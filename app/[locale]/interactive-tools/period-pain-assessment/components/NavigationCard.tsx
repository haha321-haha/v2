import Link from "next/link";

interface NavigationCardProps {
  href: string;
  title: string;
  description: string;
  features: string[];
  primaryCTA: string;
  secondaryCTA: string;
}

export default function NavigationCard({
  href,
  title,
  description,
  features,
  primaryCTA,
  secondaryCTA,
}: NavigationCardProps) {
  return (
    <article className="h-full bg-white rounded-2xl shadow-sm border border-neutral-200 hover:border-purple-400 hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-sm text-neutral-600 mb-4 flex-1">{description}</p>
        <ul className="space-y-1 text-sm text-neutral-600 mb-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="mt-1 mr-2 h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 pt-0 pb-5 space-y-2">
        <Link
          href={href}
          className="inline-flex w-full justify-center items-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-colors"
        >
          {primaryCTA}
        </Link>
        <Link
          href={href}
          className="inline-flex w-full justify-center items-center px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          {secondaryCTA}
        </Link>
      </div>
    </article>
  );
}
