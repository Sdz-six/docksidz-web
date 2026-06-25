"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import confetti from "canvas-confetti";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Download, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

type ConversionType = "word-to-pdf" | "pdf-to-word" | "image-to-pdf" | "merge-pdf" | "office-to-pdf";
type Status = "idle" | "uploading" | "converting" | "success" | "error";

interface ConverterProps {
  fixedTab?: ConversionType;
}

const DocxViewer = ({ fileUrl, onLoaded }: { fileUrl: string, onLoaded: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let isMounted = true;
    const renderDocx = async () => {
      try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        if (!isMounted || !containerRef.current) return;
        
        const docx = await import('docx-preview');
        await docx.renderAsync(blob, containerRef.current, containerRef.current, {
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
        });
        if (isMounted) onLoaded();
      } catch (e) {
        console.error("Docx preview error:", e);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = "<p class='text-error font-bold p-4'>Gagal memuat pratinjau dokumen DOCX.</p>";
          onLoaded();
        }
      }
    };
    renderDocx();
    return () => { isMounted = false; };
  }, [fileUrl, onLoaded]);

  return <div ref={containerRef} className="w-full text-black bg-white overflow-auto" />;
};

export function Converter({ fixedTab }: ConverterProps) {
  const [activeTab, setActiveTab] = useState<ConversionType>(fixedTab || "word-to-pdf");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Parallax 3D Effect variables
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / width - 0.5;
    const yPct = y / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (activeTab === "merge-pdf") {
        setFiles(prev => [...prev, ...acceptedFiles].slice(0, 10)); // Max 10 files
      } else {
        setFiles([acceptedFiles[0]]);
      }
      setStatus("idle");
      setErrorMsg("");
      setDownloadUrl(null);
    }
  }, [activeTab]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: activeTab === "word-to-pdf" 
      ? { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }
      : activeTab === "pdf-to-word" 
      ? { "application/pdf": [".pdf"] }
      : activeTab === "image-to-pdf"
      ? { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }
      : activeTab === "merge-pdf"
      ? { "application/pdf": [".pdf"] }
      : { 
          "application/vnd.ms-powerpoint": [".ppt"], 
          "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
          "application/vnd.ms-excel": [".xls"],
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
        },
    maxFiles: activeTab === "merge-pdf" ? 10 : 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleConvert = async () => {
    if (files.length === 0) return;

    if (activeTab === "merge-pdf" && files.length < 2) {
      setErrorMsg("Harap masukkan setidaknya 2 file PDF untuk digabungkan.");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setProgress(20);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file); // Backend will process all files appended under 'file'
    });

    try {
      setStatus("converting");
      setProgress(50);

      const endpoint = 
        activeTab === "word-to-pdf" ? "/api/convert/word-to-pdf" : 
        activeTab === "pdf-to-word" ? "/api/convert/pdf-to-word" : 
        activeTab === "image-to-pdf" ? "/api/convert/image-to-pdf" : 
        activeTab === "merge-pdf" ? "/api/convert/merge-pdf" : 
        "/api/convert/office-to-pdf";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Terjadi kesalahan saat pemrosesan.");
      }

      setProgress(80);
      
      const cloudConvertUrl = response.headers.get("X-Public-Url");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setPublicUrl(cloudConvertUrl);
      
      let newName = "Converted_File.pdf";
      let typeName = "Konversi";

      if (activeTab === "merge-pdf") {
        newName = "Merged_Document.pdf";
        typeName = "Gabung PDF";
      } else {
        const file = files[0];
        const newExt = activeTab === "pdf-to-word" ? ".docx" : ".pdf";
        newName = file.name.replace(/\.[^/.]+$/, "") + newExt;
        
        typeName = 
          activeTab === "word-to-pdf" ? "Word ke PDF" : 
          activeTab === "pdf-to-word" ? "PDF ke Word" : 
          activeTab === "image-to-pdf" ? "Gambar ke PDF" : "Office ke PDF";
      }

      setDownloadName(newName);

      // Simpan ke Riwayat (LocalStorage)
      try {
        const stored = localStorage.getItem("docksidz_history");
        const history = stored ? JSON.parse(stored) : [];
        const newItem = {
          id: Date.now().toString(),
          name: newName,
          type: typeName,
          url: url,
          timestamp: Date.now(),
        };
        history.push(newItem);
        localStorage.setItem("docksidz_history", JSON.stringify(history));
        window.dispatchEvent(new Event("history-updated"));
      } catch (e) {
        console.error("Gagal menyimpan riwayat", e);
      }

      setStatus("success");
      setProgress(100);
      
      // Ledakan Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#111844", "#7288AE", "#EAE0CF", "#22C55E"]
      });
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Gagal melakukan konversi.");
      setProgress(0);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setErrorMsg("");
    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    setShowPreview(false);
    setPublicUrl(null);
  };

  const handlePreview = () => {
    if (!downloadUrl || !downloadName) return;
    setShowPreview(true);
    setPreviewLoading(true);

    if (downloadName.endsWith('.pdf')) {
      setTimeout(() => setPreviewLoading(false), 500);
    } else if (downloadName.endsWith('.docx') && publicUrl) {
      setTimeout(() => setPreviewLoading(false), 1000);
    } else {
      setPreviewLoading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section id="convert" className="py-10 md:py-20 relative z-10 perspective-1000">
      <div className="container mx-auto px-4 flex justify-center perspective-[1000px]">
        <motion.div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="w-full max-w-4xl bg-surface border-4 border-border rounded-2xl sm:rounded-[36px] p-3 sm:p-6 md:p-10 neo-brutalist-shadow transition-shadow duration-300 hover:neo-brutalist-shadow-hover"
        >
          
          {/* Tabs Container */}
          {!fixedTab && (
            <div className="flex bg-background rounded-xl overflow-x-auto mb-8 neo-brutalist-shadow-sm border-2 border-border snap-x">
              {[
                { id: "word-to-pdf", label: "Word ke PDF" },
                { id: "pdf-to-word", label: "PDF ke Word" },
                { id: "image-to-pdf", label: "JPG ke PDF" },
                { id: "office-to-pdf", label: "PPT/Excel ke PDF" },
                { id: "merge-pdf", label: "Gabung PDF" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as ConversionType); handleReset(); }}
                  className={cn(
                    "flex-shrink-0 flex-1 py-3 px-3 sm:py-4 sm:px-4 font-bold text-xs sm:text-sm md:text-base transition-all border-r-2 border-border snap-center whitespace-nowrap",
                    activeTab === tab.id ? "bg-primary text-white" : "text-muted hover:text-white hover:bg-background/80"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {status === "idle" || status === "error" ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <div {...getRootProps()} className="w-full outline-none">
                  <motion.div 
                    animate={{ 
                      scale: isDragActive ? 1.05 : 1, 
                      rotate: isDragActive ? [0, -2, 2, -1, 1, 0] : 0,
                    }}
                    transition={{ 
                      rotate: { repeat: isDragActive ? Infinity : 0, duration: 0.5 },
                      scale: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    className={cn(
                      "border-4 border-dashed rounded-xl sm:rounded-[28px] p-4 sm:p-8 md:p-12 text-center cursor-pointer transition-colors duration-300 relative overflow-hidden outline-none min-h-[200px] sm:min-h-[300px] flex flex-col justify-center",
                      isDragActive ? "border-primary bg-primary/20 shadow-[0_0_50px_var(--primary)] z-50" : "border-border hover:border-primary/50 hover:bg-background/50",
                      files.length > 0 ? "bg-background" : ""
                    )}
                  >
                    <input {...getInputProps()} />
                  
                  {files.length > 0 ? (
                    <div className="flex flex-col items-center w-full">
                      <FileText className="w-16 h-16 text-primary mb-4" />
                      
                      {activeTab === "merge-pdf" ? (
                        <div className="w-full max-w-lg text-left mb-6">
                           <h4 className="font-bold mb-3 text-center border-b-2 border-border pb-2">Daftar File ({files.length}/10)</h4>
                           <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                             {files.map((f, i) => (
                               <li key={i} className="flex justify-between items-center bg-surface p-2 border-2 border-border rounded-lg text-sm">
                                  <span className="truncate flex-1 mr-2">{f.name}</span>
                                  <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-error hover:bg-error/10 p-1 rounded font-bold">X</button>
                               </li>
                             ))}
                           </ul>
                           {files.length < 10 && (
                             <p className="text-center text-sm text-primary mt-3 flex items-center justify-center gap-1">
                               <FilePlus className="w-4 h-4"/> Klik untuk tambah file lagi
                             </p>
                           )}
                        </div>
                      ) : (
                        <>
                          <p className="text-xl font-bold mb-2 break-all">{files[0].name}</p>
                          <p className="text-muted text-sm mb-6">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
                        </>
                      )}
                      
                      <div className="flex gap-4 mt-4">
                        <Button variant="outline" onClick={(e) => { e.stopPropagation(); handleReset(); }}>Batal</Button>
                        <Button 
                          onClick={(e) => { e.stopPropagation(); handleConvert(); }}
                          className="px-8"
                          disabled={activeTab === "merge-pdf" && files.length < 2}
                        >
                          Mulai Proses
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="w-12 h-12 sm:w-16 sm:h-16 text-muted mb-4 sm:mb-6 group-hover:text-primary transition-colors" />
                      <h3 className="text-lg sm:text-2xl font-bold mb-2">Tarik & Lepaskan File di Sini</h3>
                      <p className="text-xs sm:text-base text-muted mb-6">atau klik untuk menelusuri dari perangkat Anda</p>
                      <Button variant="secondary">Pilih File</Button>
                      <p className="text-xs text-muted mt-4 font-bold">
                        {activeTab === "word-to-pdf" ? "Hanya format .docx (Maks 10MB)" : 
                         activeTab === "pdf-to-word" ? "Hanya format .pdf (Maks 10MB)" : 
                         activeTab === "image-to-pdf" ? "Hanya format .jpg/.png (Maks 10MB)" :
                         activeTab === "office-to-pdf" ? "Hanya format .ppt/.pptx/.xls/.xlsx (Maks 10MB)" :
                         "Maksimal 10 File PDF (Maks 10MB per file)"}
                      </p>
                    </div>
                  )}
                  </motion.div>
                </div>

                {status === "error" && (
                  <div className="mt-6 p-4 bg-error/10 border-2 border-error text-error rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <p className="font-medium">{errorMsg}</p>
                  </div>
                )}
              </motion.div>

            ) : status === "uploading" || status === "converting" ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <RefreshCw className="w-16 h-16 text-primary animate-spin mb-6" />
                <h3 className="text-2xl font-bold mb-2">
                  {status === "uploading" ? "Mengunggah..." : "Memproses..."}
                </h3>
                <p className="text-muted mb-8">Mohon tunggu sebentar, file Anda sedang diproses oleh server.</p>
                <div className="w-full max-w-md">
                  <ProgressBar progress={progress} label="Proses" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Proses Selesai!</h3>
                <p className="text-muted mb-8">File Anda telah selesai diproses dan siap untuk diunduh.</p>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Button variant="secondary" onClick={handleReset}>Proses Lainnya</Button>
                  
                  {downloadUrl && downloadName && activeTab !== "pdf-to-word" && (
                    <Button variant="secondary" onClick={handlePreview} className="flex items-center gap-2">
                      <span className="text-xl">👀</span> Pratinjau
                    </Button>
                  )}

                  {downloadUrl && downloadName && (
                    <a href={downloadUrl} download={downloadName}>
                      <Button className="px-8 flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Unduh File
                      </Button>
                    </a>
                  )}
                </div>

                {activeTab === "pdf-to-word" && (
                  <p className="text-sm text-error/80 font-semibold mt-6 bg-error/10 py-2 px-4 rounded-lg">
                    *Catatan: Pratinjau tidak tersedia untuk PDF ke Word. Silakan langsung unduh file Anda.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 pt-24 md:p-10 md:pt-32 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface border-4 border-border rounded-2xl w-full max-w-5xl max-h-[75vh] h-full flex flex-col neo-brutalist-shadow overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b-4 border-border bg-primary text-white">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <span className="text-2xl">👀</span> Pratinjau Dokumen
                </h3>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="bg-error text-white w-10 h-10 rounded-full font-bold border-2 border-border hover:bg-error/80 transition-colors"
                >
                  X
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-4 bg-gray-100 relative">
                {previewLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-muted bg-white/80 backdrop-blur-sm">
                    <RefreshCw className="w-12 h-12 animate-spin mb-4 text-primary" />
                    <p className="font-bold">Memuat pratinjau...</p>
                  </div>
                )}
                
                {downloadName?.endsWith('.pdf') ? (
                  <iframe 
                    src={`${downloadUrl}#toolbar=0`} 
                    className="w-full h-full border-none rounded-lg bg-white"
                    title="PDF Preview"
                  />
                ) : downloadName?.endsWith('.docx') && publicUrl ? (
                  <iframe 
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicUrl)}`} 
                    className="w-full h-full border-none rounded-lg bg-white"
                    title="Word Preview"
                    onLoad={() => setPreviewLoading(false)}
                  />
                ) : downloadName?.endsWith('.docx') ? (
                  <DocxViewer fileUrl={downloadUrl!} onLoaded={() => setPreviewLoading(false)} />
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
