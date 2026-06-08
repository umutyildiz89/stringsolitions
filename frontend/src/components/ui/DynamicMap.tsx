"use client";

import { useEffect, useRef, useState } from "react";
import { Reference } from "@/lib/api";
import { X, Globe, Calendar, Briefcase, User } from "lucide-react";
import Image from "next/image";

interface MapProps {
  references: Reference[];
}

export default function DynamicMap({ references }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedProject, setSelectedProject] = useState<Reference | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      // Dynamic imports to prevent SSR errors
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map with a dark industrial base style (CartoDB Dark Matter)
      const map = L.map(mapContainerRef.current, {
        center: [39.0, 35.0], // Centered around Turkey / Middle East
        zoom: 4,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      // Define custom glowing marker icon matching design system
      const markerIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-amber-500/25 animate-ping"></div>
            <div class="w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Filter references that have coordinates
      const validReferences = references.filter(
        (ref) => ref.latitude !== undefined && ref.longitude !== undefined
      );

      validReferences.forEach((ref) => {
        if (ref.latitude === undefined || ref.longitude === undefined) return;

        const marker = L.marker([ref.latitude, ref.longitude], { icon: markerIcon }).addTo(map);

        marker.on("click", () => {
          setSelectedProject(ref);
        });
      });

      // Automatically adjust map boundaries to fit all markers
      if (validReferences.length > 0) {
        const bounds = L.latLngBounds(
          validReferences.map((ref) => [ref.latitude!, ref.longitude!])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [references]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Slide-out Project Details Modal */}
      {selectedProject && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden border border-white/15 bg-slate-900/90 text-slate-100 shadow-2xl flex flex-col max-h-[90%]">
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-heading font-semibold text-amber-500 tracking-wider uppercase">
                  Proje Detayları
                </span>
                <h3 className="font-heading font-bold text-lg text-white mt-1">
                  {selectedProject.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow font-sans text-sm">
              {/* Media gallery if available */}
              {selectedProject.image_gallery && selectedProject.image_gallery.length > 0 && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/5">
                  <Image
                    src={selectedProject.image_gallery[0]}
                    alt={selectedProject.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Data Table */}
              <div className="space-y-4 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2.5 text-slate-300">
                    <User className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Müşteri</div>
                      <div className="font-medium text-slate-200">{selectedProject.client || "Belirtilmedi"}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2.5 text-slate-300">
                    <Globe className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Konum</div>
                      <div className="font-medium text-slate-200">{selectedProject.city || "Belirtilmedi"}</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center space-x-2.5 text-slate-300">
                    <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Yıl</div>
                      <div className="font-medium text-slate-200">{selectedProject.year || "Devam Ediyor"}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2.5 text-slate-300">
                    <Briefcase className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Durum</div>
                      <div className="font-medium text-slate-200">Tamamlandı</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Scope */}
              <div className="space-y-2">
                <h4 className="font-heading font-semibold text-xs text-slate-300 uppercase tracking-wider">
                  İş Kapsamı & Detaylar
                </h4>
                <p className="text-slate-400 leading-relaxed font-light">
                  {selectedProject.scope || "Mühendislik ve devreye alma faaliyetlerini içerir."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
