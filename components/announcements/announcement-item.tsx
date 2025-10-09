"use client";

import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { Button } from "../ui/button";
import { Calendar, Loader2, Trash2 } from "lucide-react";
import type { AnnouncementItemProps } from "./types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export default function AnnouncementItem({
  announcement,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
}: AnnouncementItemProps) {
  const isExpired = () => {
    const endDate = announcement.end_date
      ? new Date(announcement.end_date)
      : null;
    return endDate && endDate < new Date();
  };

  const expired = isExpired();

  return (
    <Card
      key={announcement.id}
      className={`bg-card text-card-foreground overflow-hidden rounded-md ${
        isSelected ? "ring ring-muted-foreground" : ""
      }`}
    >
      {announcement.image_url ? (
        <div className="grid md:grid-cols-[220px_1fr]">
          {/* IMAGE LEFT (MD+) / TOP (SM) */}
          <div className="relative aspect-[16/9] md:aspect-auto md:h-full">
            <Image
              src={announcement.image_url || "/placeholder.svg"}
              alt={announcement.title}
              fill
              className="object-cover"
            />
            {/* category badge overlay */}
            <div className="absolute left-2 top-2">
              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                {announcement.content_type}
              </span>
            </div>
          </div>

          {/* CONTENT */}
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* SELECT CHECKBOX */}
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={onSelect}
                  aria-label="Select announcement"
                />
                {/* type pill */}
                <Badge variant="outline" className="gap-1.5">
                  {announcement.type === "info" && (
                    <span
                      className="size-1.5 rounded-full bg-blue-500"
                      aria-hidden="true"
                    ></span>
                  )}
                  {announcement.type === "warning" && (
                    <span
                      className="size-1.5 rounded-full bg-yellow-500"
                      aria-hidden="true"
                    ></span>
                  )}
                  {announcement.type === "error" && (
                    <span
                      className="size-1.5 rounded-full bg-red-500"
                      aria-hidden="true"
                    ></span>
                  )}
                  {announcement.type === "success" && (
                    <span
                      className="size-1.5 rounded-full bg-green-500"
                      aria-hidden="true"
                    ></span>
                  )}
                  {announcement.type}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                aria-label="Delete announcement"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-destructive-foreground" />
                )}
              </Button>
            </div>

            {/* HEADLINE */}
            <h3 className="mt-3 text-pretty text-xl font-semibold leading-tight">
              {announcement.title}
            </h3>

            {/* DEK / SUMMARY */}
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {announcement.content}
            </p>

            {/* META */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {announcement.end_date && (
                <span className="inline-flex items-center">
                  <Calendar className="mr-2 h-3.5 w-3.5" />
                  <time
                    dateTime={new Date(announcement.end_date).toISOString()}
                  >
                    {new Date(announcement.end_date).toLocaleDateString(
                      "id-ID",
                    )}
                  </time>
                </span>
              )}
              <span className="h-1 w-1 rounded-full bg-border" aria-hidden />
              <Badge variant="outline" className="gap-1.5">
                {expired ? (
                  <span
                    className="size-1.5 rounded-full bg-red-500"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <span
                    className="size-1.5 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  ></span>
                )}

                {expired
                  ? "Expired"
                  : announcement.active
                    ? "Active"
                    : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </div>
      ) : (
        // WITHOUT IMAGE: simple stacked content
        <CardContent className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                aria-label="Select announcement"
              />
              <Badge variant="outline" className="gap-1.5">
                {announcement.type === "info" && (
                  <span
                    className="size-1.5 rounded-full bg-blue-500"
                    aria-hidden="true"
                  ></span>
                )}
                {announcement.type === "warning" && (
                  <span
                    className="size-1.5 rounded-full bg-yellow-500"
                    aria-hidden="true"
                  ></span>
                )}
                {announcement.type === "error" && (
                  <span
                    className="size-1.5 rounded-full bg-red-500"
                    aria-hidden="true"
                  ></span>
                )}
                {announcement.type === "success" && (
                  <span
                    className="size-1.5 rounded-full bg-green-500"
                    aria-hidden="true"
                  ></span>
                )}
                {announcement.type}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              aria-label="Delete announcement"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive-foreground" />
              )}
            </Button>
          </div>

          <h3 className="mt-3 text-pretty text-xl font-semibold leading-tight">
            {announcement.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {announcement.content}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {announcement.start_date && (
              <Badge variant="outline" className="inline-flex items-center">
                <Calendar className="mr-2 h-3.5 w-3.5" />
                <time
                  dateTime={new Date(announcement.start_date).toISOString()}
                >
                  Mulai :{" "}
                  {new Date(announcement.start_date).toLocaleDateString(
                    "id-ID",
                  )}
                </time>
              </Badge>
            )}
            {announcement.end_date && (
              <Badge variant="outline" className="inline-flex items-center">
                <Calendar className="mr-2 h-3.5 w-3.5" />
                <time dateTime={new Date(announcement.end_date).toISOString()}>
                  Berakhir :{" "}
                  {new Date(announcement.end_date).toLocaleDateString("id-ID")}
                </time>
              </Badge>
            )}
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden />
            <Badge variant="outline" className="gap-1.5">
              {expired ? (
                <span
                  className="size-1.5 rounded-full bg-red-500"
                  aria-hidden="true"
                ></span>
              ) : (
                <span
                  className="size-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                ></span>
              )}

              {expired
                ? "Expired"
                : announcement.active
                  ? "Active"
                  : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
