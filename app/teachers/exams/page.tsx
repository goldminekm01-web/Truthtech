"use client";

import { useState, useEffect } from "react";
import { Search, Download, FileText, Filter, ExternalLink } from "lucide-react";

interface Document {
    id: string;
    title: string;
    description: string;
    category: string;
    fileUrl: string;
    fileType: 'pdf' | 'doc' | 'docx' | 'txt';
    fileSize: string;
    publishAt: string;
    slug: string;
    downloadCount?: number;
}

export default function ExamsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/documents");
            if (res.ok) {
                const data = await res.json();
                setDocuments(data.documents || []);
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ["all", "exams-papers", "notes", "revision", "projects"];
    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getFileIcon = (fileType: string) => {
        if (fileType === "pdf") return "text-red-500";
        if (fileType === "doc" || fileType === "docx") return "text-blue-500";
        return "text-gray-500";
    };

    const getFileExtension = (fileType: string) => {
        return fileType === "pdf" ? "PDF" : "Word";
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Exams & Papers
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Download past exam papers, study notes, and revision materials
                    </p>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search exams, papers, or notes..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Categories</option>
                            {categories.slice(1).map(cat => (
                                <option key={cat} value={cat}>{cat.split('-').map(w => w.charAt(0).toUpperCase()).join(' ')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Documents Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading documents...</p>
                    </div>
                ) : filteredDocs.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No documents found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocs.map((doc) => (
                            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileIcon(doc.fileType)} bg-opacity-10`}>
                                        <FileText className={`w-5 h-5 ${getFileIcon(doc.fileType)}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-sm">{doc.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{getFileExtension(doc.fileType)} • {doc.fileSize}</p>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {doc.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs text-gray-500">
                                        {new Date(doc.publishAt).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                        {doc.category.split('-').map(w => w.charAt(0).toUpperCase()).join(' ')}
                                    </span>
                                </div>

                                <a
                                    href={doc.fileUrl}
                                    download
                                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}