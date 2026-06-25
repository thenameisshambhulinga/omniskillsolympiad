"use client";

import OsoActionTile from "@/components/oso/OsoActionTile";

import { adminCommandModules } from "@/components/admin/admin-command-config";

export default function AdminCommandGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {adminCommandModules.map((module) => {
        const Icon = module.icon;

        return (
          <OsoActionTile
            key={module.href}
            href={module.href}
            icon={<Icon className="h-5 w-5" />}
            title={module.title}
            description={module.description}
            meta={module.meta}
            tone={module.tone}
          />
        );
      })}
    </div>
  );
}