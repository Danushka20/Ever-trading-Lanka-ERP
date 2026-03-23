import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, BookOpen, MessageCircle, AlertCircle, ExternalLink, LifeBuoy, Zap, Sparkles, Send } from "lucide-react"
export function HelpSection() {
  const helpResources = [
    {
      id: 1,
      title: "Knowledge Base",
      description: "Deep-dive into comprehensive protocols and integration guides.",
      icon: BookOpen,
      tag: "Self-Service",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      id: 2,
      title: "Support Concierge",
      description: "Direct access to our technical support and infrastructure teams.",
      icon: MessageCircle,
      tag: "Priority",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      id: 3,
      title: "Common Inquiries",
      description: "Synchronize with frequently asked questions and known behaviors.",
      icon: Zap,
      tag: "Fast Read",
      color: "bg-amber-50 text-amber-600 border-amber-100"
    },
  ]
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white min-h-[800px]">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm shadow-indigo-100/50">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">Support & Resources</h3>
            <p className="text-slate-500 text-sm font-medium">Access technical documentation and system assistance</p>
          </div>
        </div>
      </div>
      <CardContent className="p-8 space-y-12">
        {/* Help Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {helpResources.map((resource) => {
            const Icon = resource.icon
            return (
              <div 
                key={resource.id} 
                className="group p-6 bg-white border border-slate-100 rounded-3xl transition-all hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon className="h-24 w-24 -mr-8 -mt-8" />
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest mb-4 ${resource.color}`}>
                  <Sparkles className="h-2.5 w-2.5" />
                  {resource.tag}
                </div>
                <div className="h-12 w-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-2">
                  {resource.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 line-clamp-2">
                  {resource.description}
                </p>
                <Button variant="outline" className="w-full h-11 border-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 rounded-xl transition-all font-bold gap-2">
                  Access Portal
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            )
          })}
        </div>
        {/* System Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-slate-100">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <AlertCircle className="h-3.5 w-3.5 text-indigo-500" />
              System Architecture
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Technical telemetry and build metadata for your current operational environment.
            </p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Core Build", value: "v1.0.4-LTS" },
              { label: "Stability", value: "99.98%" },
              { label: "Node ID", value: "ACC-2024-X" },
              { label: "Environment", value: "Production" },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-sm font-bold text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Feedback Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-slate-100">
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[11px] mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
              Operational Feedback
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Submit behavioral reports or feature requests directly to the core development unit.
            </p>
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="relative group">
              <textarea
                placeholder="Synchronize your thoughts or report system behavior..."
                className="w-full min-h-[160px] p-5 bg-white border border-slate-200 rounded-3xl text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none shadow-sm"
              />
              <div className="absolute right-4 bottom-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                  Submit Packet
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
              Direct telemetry inclusion enabled for diagnostic accuracy
            </p>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
