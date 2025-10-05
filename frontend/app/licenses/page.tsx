"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export default function LicensesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-sm font-medium">9:19</span>
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Licenses</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        <p className="text-gray-600 leading-relaxed">
          Qopchiq uses various open-source libraries and components. We are grateful to the open-source community for
          their contributions.
        </p>

        <div>
          <h2 className="text-xl font-bold mb-3">Open Source Licenses</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold mb-1">React</h3>
              <p className="text-sm text-gray-600 mb-2">MIT License</p>
              <p className="text-sm text-gray-600">Copyright (c) Meta Platforms, Inc. and affiliates.</p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold mb-1">Next.js</h3>
              <p className="text-sm text-gray-600 mb-2">MIT License</p>
              <p className="text-sm text-gray-600">Copyright (c) Vercel, Inc.</p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold mb-1">Tailwind CSS</h3>
              <p className="text-sm text-gray-600 mb-2">MIT License</p>
              <p className="text-sm text-gray-600">Copyright (c) Tailwind Labs, Inc.</p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold mb-1">Lucide Icons</h3>
              <p className="text-sm text-gray-600 mb-2">ISC License</p>
              <p className="text-sm text-gray-600">Copyright (c) Lucide Contributors</p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold mb-1">Radix UI</h3>
              <p className="text-sm text-gray-600 mb-2">MIT License</p>
              <p className="text-sm text-gray-600">Copyright (c) WorkOS</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">MIT License</h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 leading-relaxed font-mono">
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
              associated documentation files (the "Software"), to deal in the Software without restriction, including
              without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
              following conditions: The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          For a complete list of all dependencies and their licenses, please visit our GitHub repository or contact us
          at legal@qopchiq.uz
        </p>
      </div>
    </div>
  )
}
