'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please upload a PDF, DOCX, or TXT file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please upload a PDF, DOCX, or TXT file');
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    return validTypes.includes(file.type) || file.name.endsWith('.docx') || file.name.endsWith('.pdf') || file.name.endsWith('.txt');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setResult(null);
    setUploadProgress(0);

    const formData = new FormData(e.currentTarget);
    if (selectedFile) {
      formData.set('file', selectedFile);
    }

    // Simulate progress (replace with actual progress tracking if your API supports it)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (data.success) {
        setResult(data);
        setTimeout(() => setUploadProgress(0), 2000);
      } else {
        setError(data.error);
        setUploadProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setResult(null);
    setError('');
    setUploadProgress(0);
    if (formRef.current) {
      formRef.current.reset();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {!result && (
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-200">
          <CardContent className="p-0">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : selectedFile
                    ? 'border-green-400 bg-green-50/50'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="space-y-4">
                  {selectedFile ? (
                    <>
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div>
                        <p className="font-medium text-green-700">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                        <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                          Ready to upload
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <span className="text-2xl">📁</span>
                      </div>
                      <div>
                        <p className="text-lg font-medium mb-2">
                          {dragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                        </p>
                        <p className="text-muted-foreground mb-4">
                          or click to browse files
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Badge variant="outline">PDF</Badge>
                          <Badge variant="outline">DOCX</Badge>
                          <Badge variant="outline">TXT</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Maximum file size: 10MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., React.js Fundamentals"
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="e.g., Computer Science"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="flex-1 h-11"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      📤 Upload File
                    </>
                  )}
                </Button>
                
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="h-11"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <span className="text-lg">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {result && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              ✅ Upload Successful!
            </CardTitle>
            <CardDescription>
              Your file has been processed and is ready for quiz generation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Title:</p>
                  <p>{result.syllabus.title}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Subject:</p>
                  <p>{result.syllabus.subject || 'Not specified'}</p>
                </div>
              </div>
              
              {result.contentPreview && (
                <div>
                  <p className="font-medium text-muted-foreground mb-2">Content Preview:</p>
                  <div className="bg-background/80 p-3 rounded-md text-sm border">
                    <p className="line-clamp-3">{result.contentPreview}</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  size="sm"
                >
                  Upload Another File
                </Button>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Ready for quiz generation
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}