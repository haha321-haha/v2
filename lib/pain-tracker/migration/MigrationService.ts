// MigrationService - Enhanced Pain Tracker Data Migration System
// Handles schema versioning and data migration between different versions

import {
  StoredData,
  Migration,
  MigrationPlan,
  PainTrackerError,
  CURRENT_SCHEMA_VERSION,
  PainRecord,
} from "../../../types/pain-tracker";
import { logInfo, logError } from "@/lib/debug-logger";

interface Medication {
  name: string;
  dosage: string;
  timing: string;
}

interface LifestyleFactor {
  factor: string;
  value: number;
}

export class MigrationService {
  private migrations: Map<string, Migration> = new Map();

  constructor() {
    this.initializeMigrations();
  }

  /**
   * Initialize all available migrations
   */
  private initializeMigrations(): void {
    // Migration from version 0 (legacy) to version 1 (enhanced)
    this.registerMigration({
      version: 1,
      description: "Migrate from legacy pain tracker to enhanced version",
      up: this.migrateLegacyToV1.bind(this),
      down: this.migrateV1ToLegacy.bind(this),
      validate: this.validateV1Data.bind(this),
    });

    // Future migrations will be added here
    // Example:
    // this.registerMigration({
    //   version: 2,
    //   description: 'Add new fields for version 2',
    //   up: this.migrateV1ToV2.bind(this),
    //   down: this.migrateV2ToV1.bind(this),
    //   validate: this.validateV2Data.bind(this)
    // });
  }

  /**
   * Register a new migration
   */
  registerMigration(migration: Migration): void {
    const key = `v${migration.version}`;
    this.migrations.set(key, migration);
  }

  /**
   * Get migration plan for upgrading from one version to another
   */
  getMigrationPlan(fromVersion: number, toVersion: number): MigrationPlan {
    const migrations: Migration[] = [];

    for (let version = fromVersion + 1; version <= toVersion; version++) {
      const migration = this.migrations.get(`v${version}`);
      if (migration) {
        migrations.push(migration);
      } else {
        throw new PainTrackerError(
          `No migration found for version ${version}`,
          "MIGRATION_ERROR",
        );
      }
    }

    return {
      fromVersion,
      toVersion,
      migrations,
    };
  }

  /**
   * Execute migration plan
   */
  async executeMigrationPlan(
    data: unknown,
    plan: MigrationPlan,
  ): Promise<StoredData> {
    let migratedData = data;

    try {
      for (const migration of plan.migrations) {
        logInfo(
          `Executing migration: ${migration.description}`,
          undefined,
          "MigrationService/executeMigrationPlan",
        );

        // Create backup before migration
        const backup = JSON.parse(JSON.stringify(migratedData));

        try {
          // Execute migration
          migratedData = migration.up(migratedData) as StoredData;

          // Validate migrated data
          if (!migration.validate(migratedData)) {
            throw new Error("Migration validation failed");
          }

          logInfo(
            `Migration to version ${migration.version} completed successfully`,
            undefined,
            "MigrationService/executeMigrationPlan",
          );
        } catch (error) {
          logError(
            `Migration to version ${migration.version} failed:`,
            error,
            "MigrationService/executeMigrationPlan",
          );

          // Attempt rollback
          try {
            migratedData = migration.down(backup) as StoredData;
            logInfo(
              `Rollback to previous version successful`,
              undefined,
              "MigrationService/executeMigrationPlan",
            );
          } catch (rollbackError) {
            logError(
              "Rollback failed:",
              rollbackError,
              "MigrationService/executeMigrationPlan",
            );
          }

          throw new PainTrackerError(
            `Migration to version ${migration.version} failed: ${error}`,
            "MIGRATION_ERROR",
            { originalError: error, backup },
          );
        }
      }

      return migratedData as StoredData;
    } catch (error) {
      if (error instanceof PainTrackerError) {
        throw error;
      }

      throw new PainTrackerError(
        "Migration plan execution failed",
        "MIGRATION_ERROR",
        error,
      );
    }
  }

  /**
   * Check if migration is needed
   */
  isMigrationNeeded(currentVersion: number): boolean {
    return currentVersion < CURRENT_SCHEMA_VERSION;
  }

  /**
   * Get current schema version
   */
  getCurrentVersion(): number {
    return CURRENT_SCHEMA_VERSION;
  }

  /**
   * Migrate from legacy pain tracker (version 0) to enhanced version 1
   */
  private migrateLegacyToV1(legacyData: unknown): StoredData {
    try {
      // Handle different legacy data formats
      let legacyRecords: Record<string, unknown>[] = [];

      if (Array.isArray(legacyData)) {
        // Direct array of records
        legacyRecords = legacyData as Record<string, unknown>[];
      } else if (
        legacyData &&
        Array.isArray((legacyData as { records?: unknown }).records)
      ) {
        // Wrapped in records property
        legacyRecords = (legacyData as { records: unknown[] })
          .records as Record<string, unknown>[];
      } else if (
        legacyData &&
        (legacyData as { painEntries?: unknown }).painEntries
      ) {
        // Old format with painEntries
        legacyRecords = (legacyData as { painEntries: unknown[] })
          .painEntries as Record<string, unknown>[];
      } else {
        // No legacy data found
        legacyRecords = [];
      }

      // Convert legacy records to new format
      const migratedRecords = legacyRecords.map((legacyRecord, index) => {
        const now = new Date();

        return {
          id: (legacyRecord.id as string) || `migrated_${Date.now()}_${index}`,
          date:
            (legacyRecord.date as string) || now.toISOString().split("T")[0],
          time: this.extractTimeFromLegacyRecord(legacyRecord) || "12:00",
          painLevel: this.normalizePainLevel(
            legacyRecord.intensity || legacyRecord.painLevel || 0,
          ),
          painTypes: this.migratePainTypes(legacyRecord),
          locations: this.migrateLocations(legacyRecord),
          symptoms: this.migrateSymptoms(
            (legacyRecord.symptoms as unknown[]) || [],
          ),
          menstrualStatus: this.migrateMenstrualStatus(
            legacyRecord.menstrualStatus as string,
          ),
          medications: this.migrateMedications(
            ((legacyRecord.treatments ||
              legacyRecord.medications) as unknown[]) || [],
          ),
          effectiveness: this.normalizeEffectiveness(
            legacyRecord.effectiveness || 0,
          ),
          lifestyleFactors: this.migrateLifestyleFactors(legacyRecord),
          notes: (legacyRecord.notes as string) || "",
          createdAt: legacyRecord.createdAt
            ? new Date(legacyRecord.createdAt as string | number | Date)
            : now,
          updatedAt: legacyRecord.updatedAt
            ? new Date(legacyRecord.updatedAt as string | number | Date)
            : now,
        };
      });

      // Create new data structure
      const migratedData: StoredData = {
        records: migratedRecords as unknown as PainRecord[],
        preferences: {
          defaultMedications: [],
          reminderSettings: {
            enabled: false,
            frequency: "daily",
            time: "20:00",
          },
          exportPreferences: {
            defaultFormat: "pdf",
            includeChartsDefault: true,
            includeSummaryDefault: true,
            defaultDateRange: "last_3_months",
          },
          privacySettings: {
            allowAnalytics: true,
            allowExport: true,
            dataRetentionMonths: 24,
            requireConfirmationForDelete: true,
          },
          displaySettings: {
            theme: "auto",
            language: "en",
            dateFormat: "MM/DD/YYYY",
            timeFormat: "12h",
          },
        },
        schemaVersion: 1,
        lastBackup: new Date(),
        metadata: {
          createdAt: new Date(),
          lastModified: new Date(),
          version: "1.0.0",
          recordCount: migratedRecords.length,
          dataSize: 0, // Will be calculated by storage adapter
        },
      };

      return migratedData;
    } catch (error) {
      throw new PainTrackerError(
        "Failed to migrate legacy data to version 1",
        "MIGRATION_ERROR",
        error,
      );
    }
  }

  /**
   * Migrate from enhanced version 1 back to legacy format (rollback)
   */
  private migrateV1ToLegacy(v1Data: StoredData): Record<string, unknown>[] {
    try {
      const legacyRecords = v1Data.records.map((record) => ({
        id: record.id,
        date: record.date,
        intensity: record.painLevel,
        menstrualStatus: this.convertMenstrualStatusToLegacy(
          record.menstrualStatus,
        ),
        symptoms: record.symptoms,
        treatments: record.medications.map((med) => med.name),
        effectiveness: record.effectiveness,
        notes: record.notes,
      }));

      return legacyRecords;
    } catch (error) {
      throw new PainTrackerError(
        "Failed to rollback from version 1 to legacy",
        "MIGRATION_ERROR",
        error,
      );
    }
  }

  /**
   * Validate version 1 data structure
   */
  private validateV1Data(data: unknown): boolean {
    try {
      if (!data || typeof data !== "object") return false;
      const dataObj = data as Record<string, unknown>;
      return (
        Array.isArray(dataObj.records) &&
        typeof dataObj.preferences === "object" &&
        dataObj.schemaVersion === 1 &&
        (dataObj.records as unknown[]).every((record: unknown) =>
          this.validateV1Record(record),
        )
      );
    } catch {
      return false;
    }
  }

  /**
   * Validate individual version 1 record
   */
  private validateV1Record(record: unknown): boolean {
    if (!record || typeof record !== "object") return false;
    const recordObj = record as Record<string, unknown>;
    return (
      typeof recordObj.id === "string" &&
      typeof recordObj.date === "string" &&
      typeof recordObj.time === "string" &&
      typeof recordObj.painLevel === "number" &&
      Array.isArray(recordObj.painTypes) &&
      Array.isArray(recordObj.locations) &&
      Array.isArray(recordObj.symptoms) &&
      Array.isArray(recordObj.medications) &&
      Array.isArray(recordObj.lifestyleFactors)
    );
  }

  /**
   * Extract time from legacy record (may not have separate time field)
   */
  private extractTimeFromLegacyRecord(
    legacyRecord: Record<string, unknown>,
  ): string {
    if (legacyRecord.time) {
      return legacyRecord.time as string;
    }

    if (legacyRecord.createdAt) {
      const date = new Date(legacyRecord.createdAt as string | number | Date);
      return `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    return "12:00"; // Default time
  }

  /**
   * Normalize pain level to 0-10 scale
   */
  private normalizePainLevel(level: unknown): number {
    const numLevel = Number(level);
    if (isNaN(numLevel)) return 0;
    return Math.max(0, Math.min(10, Math.round(numLevel)));
  }

  /**
   * Normalize effectiveness to 0-10 scale
   */
  private normalizeEffectiveness(effectiveness: unknown): number {
    const numEffectiveness = Number(effectiveness);
    if (isNaN(numEffectiveness)) return 0;
    return Math.max(0, Math.min(10, Math.round(numEffectiveness)));
  }

  /**
   * Migrate pain types from legacy format
   */
  private migratePainTypes(legacyRecord: Record<string, unknown>): string[] {
    const painTypes: string[] = [];

    // Check various legacy fields that might contain pain type info
    if (legacyRecord.painType) {
      painTypes.push(this.mapLegacyPainType(legacyRecord.painType as string));
    }

    if (legacyRecord.painTypes && Array.isArray(legacyRecord.painTypes)) {
      painTypes.push(
        ...(legacyRecord.painTypes as unknown[]).map((pt) =>
          this.mapLegacyPainType(pt as string),
        ),
      );
    }

    // If no pain types found, try to infer from notes or other fields
    if (painTypes.length === 0 && legacyRecord.notes) {
      const inferredTypes = this.inferPainTypesFromNotes(
        legacyRecord.notes as string,
      );
      painTypes.push(...inferredTypes);
    }

    return [...new Set(painTypes)]; // Remove duplicates
  }

  /**
   * Map legacy pain type to new format
   */
  private mapLegacyPainType(legacyType: string): string {
    const mapping: { [key: string]: string } = {
      cramping: "cramping",
      dull_pain: "aching",
      sharp_pain: "sharp",
      throbbing: "throbbing",
      burning: "burning",
      pressure: "pressure",
      // Add more mappings as needed
    };

    return mapping[legacyType] || "aching"; // Default to aching
  }

  /**
   * Migrate locations from legacy format
   */
  private migrateLocations(legacyRecord: Record<string, unknown>): string[] {
    const locations: string[] = [];

    if (legacyRecord.location) {
      locations.push(this.mapLegacyLocation(legacyRecord.location as string));
    }

    if (legacyRecord.locations && Array.isArray(legacyRecord.locations)) {
      locations.push(...legacyRecord.locations.map(this.mapLegacyLocation));
    }

    return [...new Set(locations)]; // Remove duplicates
  }

  /**
   * Map legacy location to new format
   */
  private mapLegacyLocation(legacyLocation: string): string {
    const mapping: { [key: string]: string } = {
      lower_abdomen: "lower_abdomen",
      lower_back: "lower_back",
      thighs: "upper_thighs",
      pelvis: "pelvis",
      side: "side",
      whole_abdomen: "whole_abdomen",
      other: "lower_abdomen", // Default mapping
    };

    return mapping[legacyLocation] || "lower_abdomen";
  }

  /**
   * Migrate symptoms from legacy format
   */
  private migrateSymptoms(legacySymptoms: unknown[]): string[] {
    if (!Array.isArray(legacySymptoms)) {
      return [];
    }

    return legacySymptoms.map((symptom) =>
      this.mapLegacySymptom(String(symptom)),
    );
  }

  /**
   * Map legacy symptom to new format
   */
  private mapLegacySymptom(legacySymptom: string): string {
    const mapping: { [key: string]: string } = {
      nausea: "nausea",
      headache: "headache",
      fatigue: "fatigue",
      bloating: "bloating",
      mood_changes: "mood_changes",
      back_pain: "fatigue", // Map to closest available symptom
      vomiting: "vomiting",
      diarrhea: "diarrhea",
      breast_tenderness: "breast_tenderness",
    };

    return mapping[legacySymptom] || "fatigue";
  }

  /**
   * Migrate menstrual status from legacy format
   */
  private migrateMenstrualStatus(legacyStatus: string): string {
    const mapping: { [key: string]: string } = {
      before: "before_period",
      during: "day_1",
      after: "after_period",
      none: "mid_cycle",
      before_period: "before_period",
      day_1: "day_1",
      day_2_3: "day_2_3",
      day_4_plus: "day_4_plus",
      after_period: "after_period",
      mid_cycle: "mid_cycle",
      irregular: "irregular",
    };

    return mapping[legacyStatus] || "mid_cycle";
  }

  /**
   * Convert menstrual status back to legacy format
   */
  private convertMenstrualStatusToLegacy(status: string): string {
    const mapping: { [key: string]: string } = {
      before_period: "before",
      day_1: "during",
      day_2_3: "during",
      day_4_plus: "during",
      after_period: "after",
      mid_cycle: "none",
      irregular: "none",
    };

    return mapping[status] || "none";
  }

  /**
   * Migrate medications from legacy treatments
   */
  private migrateMedications(legacyTreatments: unknown[]): Medication[] {
    if (!Array.isArray(legacyTreatments)) {
      return [];
    }

    return legacyTreatments.map((treatment) => {
      if (typeof treatment === "string") {
        return {
          name: treatment,
          dosage: "",
          timing: "during pain",
        };
      } else if (
        typeof treatment === "object" &&
        treatment !== null &&
        "name" in treatment
      ) {
        const treatmentObj = treatment as {
          name: string;
          dosage?: string;
          timing?: string;
        };
        return {
          name: treatmentObj.name,
          dosage: treatmentObj.dosage || "",
          timing: treatmentObj.timing || "during pain",
        };
      }

      return {
        name: "Unknown medication",
        dosage: "",
        timing: "during pain",
      };
    });
  }

  /**
   * Migrate lifestyle factors (new in v1, so create defaults)
   */
  private migrateLifestyleFactors(
    legacyRecord: Record<string, unknown>,
  ): LifestyleFactor[] {
    const factors: LifestyleFactor[] = [];

    // Try to extract any lifestyle information from notes or other fields
    if (legacyRecord.notes) {
      const stressMatch = (legacyRecord.notes as string).match(
        /stress.*?(\d+)/i,
      );
      if (stressMatch) {
        factors.push({
          factor: "stress_level",
          value: parseInt(stressMatch[1]),
        });
      }

      const sleepMatch = (legacyRecord.notes as string).match(/sleep.*?(\d+)/i);
      if (sleepMatch) {
        factors.push({
          factor: "sleep_hours",
          value: parseInt(sleepMatch[1]),
        });
      }
    }

    return factors;
  }

  /**
   * Infer pain types from notes text
   */
  private inferPainTypesFromNotes(notes: string): string[] {
    const types: string[] = [];
    const lowerNotes = notes.toLowerCase();

    if (lowerNotes.includes("cramp")) types.push("cramping");
    if (lowerNotes.includes("sharp")) types.push("sharp");
    if (lowerNotes.includes("throb")) types.push("throbbing");
    if (lowerNotes.includes("burn")) types.push("burning");
    if (lowerNotes.includes("pressure")) types.push("pressure");
    if (lowerNotes.includes("ache") || lowerNotes.includes("dull"))
      types.push("aching");

    return types;
  }
}

export default MigrationService;
