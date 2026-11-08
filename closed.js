/* Online ordering switch. Set CLOSED to "" to reopen. */
window.SCOTTS_CLOSED=(new Date()<new Date("2026-11-10T00:00:00+10:00"))?"Closed today (Mon 9 Nov). See you tomorrow from 7:30am!":"";
(function(){var m=window.SCOTTS_CLOSED;if(!m)return;document.addEventListener("DOMContentLoaded",function(){var b=document.createElement("div");b.textContent=m;b.setAttribute("role","status");b.style.cssText="position:sticky;top:0;z-index:999;background:#1B1713;color:#fff;text-align:center;padding:14px 16px;font-weight:700;font-size:15px";document.body.insertBefore(b,document.body.firstChild);});})();
