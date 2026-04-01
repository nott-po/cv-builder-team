"use client";

import { Fragment } from "react";

import { useTranslations } from "next-intl";

import { FloatingLabelWrapper, floatingInputClass } from "@/components/ui/floating-label-wrapper";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type FlatCategory = {
    id: string;
    name: string;
    parent: { id: string; name: string } | null;
};

export type CategoriesResult = { skillCategories: FlatCategory[] };

type SkillCategorySelectProps = {
    categories: FlatCategory[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
};

export function SkillCategorySelect({
    categories,
    value,
    onChange,
    disabled,
    error,
}: SkillCategorySelectProps) {
    const t = useTranslations("Admin");

    const parents = categories.filter((c) => !c.parent);

    const childrenByParentId = new Map<string, FlatCategory[]>();
    for (const c of categories) {
        if (!c.parent) continue;
        const group = childrenByParentId.get(c.parent.id) ?? [];
        group.push(c);
        childrenByParentId.set(c.parent.id, group);
    }

    return (
        <FloatingLabelWrapper label={t("category")} error={error}>
            <Select onValueChange={onChange} value={value} disabled={disabled}>
                <SelectTrigger className={floatingInputClass}>
                    <SelectValue placeholder={t("category")} />
                </SelectTrigger>
                <SelectContent side="bottom" avoidCollisions={false} className="max-h-60">
                    {parents.length > 0
                        ? parents.map((parent, index) => {
                              const groupChildren = childrenByParentId.get(parent.id) ?? [];
                              const isLast = index === parents.length - 1;

                              return (
                                  <Fragment key={parent.id}>
                                      {groupChildren.length === 0 ? (
                                          <SelectItem value={parent.id}>{parent.name}</SelectItem>
                                      ) : (
                                          <SelectGroup>
                                              <SelectLabel>{parent.name}</SelectLabel>
                                              {groupChildren.map((child) => (
                                                  <SelectItem
                                                      key={child.id}
                                                      value={child.id}
                                                      className="pl-6"
                                                  >
                                                      {child.name}
                                                  </SelectItem>
                                              ))}
                                          </SelectGroup>
                                      )}
                                      {!isLast && <SelectSeparator />}
                                  </Fragment>
                              );
                          })
                        : categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                              </SelectItem>
                          ))}
                </SelectContent>
            </Select>
        </FloatingLabelWrapper>
    );
}
