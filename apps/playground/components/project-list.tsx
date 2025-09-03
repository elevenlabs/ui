"use client"

import { Fragment } from "react"

import type { Project } from "@/lib/projects"
import { cn } from "@/lib/utils"
import { ProjectCard } from "@/components/project-card"

export function ProjectList({
  projects,
  small,
}: {
  projects: Project[]
  small?: boolean
}) {
  return (
    <>
      <div
        className={cn(
          "mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2",
          small ? "xl:grid-cols-2" : "xl:grid-cols-3"
        )}
      >
        {projects.map((project) => (
          <Fragment key={project.slug}>
            <ProjectCard project={project} />
          </Fragment>
        ))}
      </div>
    </>
  )
}
