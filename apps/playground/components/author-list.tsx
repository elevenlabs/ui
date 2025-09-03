"use client"

import { Fragment } from "react"
import type { AuthorWithProjectCount } from "@showcase/data/api/authors-list"

import { AuthorCard } from "@/components/author-card"

export function AuthorList({ authors }: { authors: AuthorWithProjectCount[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {authors.map((author) => (
        <Fragment key={author.slug}>
          <AuthorCard author={author} />
        </Fragment>
      ))}
    </div>
  )
}
