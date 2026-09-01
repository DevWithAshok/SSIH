import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Bookmark, 
  EyeOff, 
  Share2, 
  ChevronDown, 
  ChevronUp,
  Award,
  Building2,
  Users
} from 'lucide-react';

export function PostCard({ post, onToggleBookmark, onDismiss }) {
  const [expanded, setExpanded] = useState(false);

  // Trust badge helper
  const renderTrustBadge = () => {
    const tier = post.source?.trustTier;
    switch (tier) {
      case 'OFFICIAL':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            Official Notice
          </span>
        );
      case 'PLACEMENT_CELL':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-3 h-3 text-emerald-400" />
            Placement Cell
          </span>
        );
      case 'VERIFIED_CLUB':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Users className="w-3 h-3 text-purple-400" />
            Verified Club
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
            <Building2 className="w-3 h-3" />
            Department
          </span>
        );
    }
  };

  // Priority indicator color
  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    if (score >= 50) return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    return 'bg-slate-800 text-slate-400 border-slate-700';
  };

  return (
    <article className="rounded-2xl glass-card border border-slate-800/80 p-5 transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-black/20 group">
      
      {/* Top Header: Trust, Source, Priority & Actions */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {renderTrustBadge()}
          <span className="text-xs text-slate-400 font-medium">
            {post.source?.organization}
          </span>
          <span className="text-slate-600 text-xs">•</span>
          <span className="text-xs text-slate-500">
            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Priority Score Tag */}
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getScoreBadgeClass(post.priorityScore)}`}>
            {post.priorityScore} pts
          </span>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(post.id)}
            className={`p-1.5 rounded-lg border transition-all ${
              post.isBookmarked 
                ? 'bg-amber-400/10 border-amber-400/40 text-amber-400' 
                : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title={post.isBookmarked ? 'Remove bookmark' : 'Bookmark for later'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${post.isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Dismiss Button */}
          <button
            onClick={() => onDismiss(post.id)}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
            title="Dismiss / Hide notice"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Title & Deadline Badge */}
      <div className="mb-3">
        <h3 className="text-base font-bold text-slate-100 group-hover:text-white leading-snug tracking-tight mb-2">
          {post.title}
        </h3>

        {post.deadlineStatus && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 mb-2">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>{post.deadlineStatus.text}</span>
            {post.deadlineDate && (
              <span className="text-[11px] text-rose-400/70 font-normal">
                ({new Date(post.deadlineDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </span>
            )}
          </div>
        )}

        {/* Post Content / Summary */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {expanded ? post.content : post.summary}
        </p>

        {post.content.length > 140 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium mt-1 transition-colors"
          >
            {expanded ? (
              <>Show less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Read full announcement <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}
      </div>

      {/* Tags and Target Audience Info */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/60 flex-wrap">
        <div className="flex flex-wrap gap-1.5 items-center">
          {post.tags && post.tags.map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 font-medium">
              #{tag}
            </span>
          ))}
          {post.targetYears && post.targetYears.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 font-medium">
              Year: {post.targetYears.join(', ')}
            </span>
          )}
        </div>

        {/* Action Link (Apply / Portal) */}
        {post.actionUrl && (
          <a
            href={post.actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20 transition-all ml-auto"
          >
            <span>Access Opportunity</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

    </article>
  );
}
