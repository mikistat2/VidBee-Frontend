import { useNavigate } from 'react-router-dom'
import { usePlatform } from '../hooks/usePlatform'
import { useState } from 'react'
import apkUrl from '../assets/VidBee.apk?url'

const HIGHLIGHTS = [
  {
    icon: '⚡',
    title: 'Instant quiz generation',
    desc: 'Upload any PDF or document and get targeted practice questions in under 10 seconds.',
    accent: '#FACC15',
    accentRgb: '250,204,21',
  },
  {
    icon: '🎯',
    title: 'Exam-style questions',
    desc: 'Designed around real university exam formats, including Hawassa University and more.',
    accent: '#34D399',
    accentRgb: '52,211,153',
  },
  {
    icon: '📄',
    title: 'Your content, your quiz',
    desc: 'Every question is pulled directly from your materials — no generic filler.',
    accent: '#818CF8',
    accentRgb: '129,140,248',
  },
]

function DownloadButton({ mobile = false, variant = 'yellow' }) {
  const isYellow = variant === 'yellow'

  return (
    <a
      href={apkUrl}
      download="VidBee.apk"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: mobile ? 12 : 18,
        textDecoration: 'none',
        borderRadius: mobile ? 16 : 22,
        padding: mobile ? '16px 22px' : '22px 34px',
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800,
        fontSize: mobile ? 14 : 18,
        letterSpacing: '-0.03em',
        cursor: 'pointer',
        background: isYellow ? '#facc15' : 'rgba(255,255,255,0.05)',
        color: isYellow ? '#0b0d10' : '#facc15',
        border: isYellow ? 'none' : '1.5px solid rgba(250,204,21,0.22)',
        boxShadow: isYellow
          ? '0 8px 32px rgba(250,204,21,0.28), 0 2px 8px rgba(0,0,0,0.4)'
          : '0 8px 32px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.08)',
        transition: 'transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.025)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
      }}
    >
      <span style={{
        width: mobile ? 36 : 48,
        height: mobile ? 36 : 48,
        borderRadius: mobile ? 10 : 14,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isYellow ? 'rgba(0,0,0,0.12)' : 'rgba(250,204,21,0.12)',
        border: `1.5px solid ${isYellow ? 'rgba(0,0,0,0.10)' : 'rgba(250,204,21,0.22)'}`,
        fontSize: mobile ? 16 : 22,
        flexShrink: 0,
      }}>⬇</span>

      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>Download Android App</span>
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: mobile ? 10 : 12,
          fontWeight: 600,
          color: isYellow ? 'rgba(11,13,16,0.56)' : 'rgba(250,204,21,0.52)',
          marginTop: 4,
        }}>
          APK file · install on Android
        </span>
      </span>
    </a>
  )
}

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { overflow-x: hidden; width: 100%; position: relative; }

  :root {
    --bg:        #08090A;
    --bg2:       #0E0F11;
    --surface:   #13141A;
    --surface2:  #1A1B22;
    --border:    rgba(255,255,255,0.06);
    --border2:   rgba(255,255,255,0.10);
    --text:      #EEEEF0;
    --text2:     #9899A6;
    --text3:     #55566A;
    --yellow:    #FACC15;
    --yellow2:   #F59E0B;
    --radius-sm: 12px;
    --radius-md: 18px;
    --radius-lg: 24px;
  }

  html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
  button { cursor: pointer; font-family: var(--font-disp); }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float    { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-9px) rotate(1.5deg)} 70%{transform:translateY(-4px) rotate(-1deg)} }
  @keyframes floatAlt { 0%,100%{transform:translateY(0)} 45%{transform:translateY(-7px)} }
  @keyframes shimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes orbit    { from{transform:rotate(0deg) translateX(var(--r,130px)) rotate(0deg)} to{transform:rotate(360deg) translateX(var(--r,130px)) rotate(-360deg)} }
  @keyframes gradShift{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(.88)} }
  @keyframes borderGlow{0%,100%{box-shadow:0 0 0 0 rgba(250,204,21,0)} 50%{box-shadow:0 0 22px 3px rgba(250,204,21,0.16)}}

  .fu1{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .05s both}
  .fu2{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .16s both}
  .fu3{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .27s both}
  .fu4{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .38s both}
  .fu5{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .49s both}
  .fu6{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .60s both}
  .fu7{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .70s both}

  .shimmer-btn::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.2) 50%,transparent 65%);
    background-size:600px 100%;
    animation:shimmer 3s linear infinite;
    border-radius:inherit;
  }

  .grain::after {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:9999;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.032'/%3E%3C/svg%3E");
  }
`

/* ═══════════════════════════════════════
   MOBILE
═══════════════════════════════════════ */
function MobileLanding({ navigate }) {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="grain" style={{
        minHeight:'100svh', background:'var(--bg)',
        display:'flex', flexDirection:'column',
        position:'relative', overflow:'hidden',
      }}>

        {/* Ambient glow */}
        <div style={{
          position:'absolute', top:-100, left:'50%', transform:'translateX(-50%)',
          width:400, height:400, borderRadius:'50%', pointerEvents:'none', zIndex:0,
          background:'radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 65%)',
        }}/>
        <div style={{
          position:'absolute', bottom:-60, right:-80,
          width:280, height:280, borderRadius:'50%', pointerEvents:'none', zIndex:0,
          background:'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)',
        }}/>

        {/* Header */}
        <header className="fu1" style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'22px 22px 0', position:'relative', zIndex:2,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:11 }}>
            <div style={{
              width:42, height:42, borderRadius:14,
              background:'linear-gradient(145deg,#1C1C24,#101014)',
              border:'1px solid rgba(250,204,21,0.22)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:21,
              animation:'float 5s ease-in-out infinite, borderGlow 4s ease-in-out infinite',
            }}>🐝</div>
            <div>
              <p style={{ fontFamily:'var(--font-disp)', fontSize:16, fontWeight:800, letterSpacing:'-0.04em', lineHeight:1.1 }}>VidBee</p>
              <p style={{ fontSize:10.5, color:'var(--text3)', fontWeight:500, letterSpacing:'0.02em', marginTop:1 }}>AI study companion</p>
            </div>
          </div>
          <button onClick={() => navigate('/auth')} style={{
            background:'transparent', border:'1px solid var(--border2)',
            color:'var(--text2)', borderRadius:10, padding:'7px 15px',
            fontSize:12.5, fontWeight:600, letterSpacing:'-0.015em',
            transition:'border-color .2s, color .2s',
          }}>Sign in</button>
        </header>

        {/* Hero */}
        <div style={{ padding:'40px 22px 0', position:'relative', zIndex:2 }}>

          <div className="fu2" style={{
            display:'inline-flex', alignItems:'center', gap:7,
            background:'rgba(250,204,21,0.07)', border:'1px solid rgba(250,204,21,0.18)',
            borderRadius:100, padding:'5px 13px 5px 9px', marginBottom:22,
          }}>
            <span style={{
              width:7, height:7, borderRadius:'50%', background:'var(--yellow)',
              display:'inline-block', boxShadow:'0 0 10px rgba(250,204,21,0.9)',
              animation:'pulse 2.4s ease-in-out infinite',
            }}/>
            <span style={{ fontSize:11, color:'var(--yellow)', fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase' }}>
              Now live
            </span>
          </div>

          <h1 className="fu3" style={{
            fontFamily:'var(--font-disp)', fontSize:38, fontWeight:800,
            lineHeight:1.02, letterSpacing:'-0.045em', color:'var(--text)',
          }}>
            Turn your notes<br/>into a<br/>
            <span style={{
              background:'linear-gradient(135deg,#FACC15 0%,#F59E0B 40%,#FACC15 100%)',
              backgroundSize:'200% 200%', animation:'gradShift 5s ease infinite',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>practice exam.</span>
          </h1>

          <p className="fu4" style={{
            marginTop:17, fontSize:14.5, color:'var(--text2)',
            lineHeight:1.68, fontWeight:400, maxWidth:310,
          }}>
            Upload any PDF and get targeted quiz questions in seconds. Built for serious university prep.
          </p>
        </div>

        {/* Stats strip */}
        <div className="fu5" style={{
          display:'flex', gap:0, margin:'28px 22px 0',
          background:'var(--surface)', border:'1px solid var(--border)',
          borderRadius:'var(--radius-md)', overflow:'hidden',
          position:'relative', zIndex:2,
        }}>
          {[['⚡ < 10s','generation'],['🎓 Any','document'],['✨ Free','to start']].map(([top,bot],i) => (
            <div key={i} style={{
              flex:1, textAlign:'center', padding:'13px 6px',
              borderRight: i<2 ? '1px solid var(--border)' : 'none',
            }}>
              <p style={{ fontFamily:'var(--font-disp)', fontSize:13.5, fontWeight:800, letterSpacing:'-0.03em' }}>{top}</p>
              <p style={{ fontSize:10.5, color:'var(--text3)', marginTop:2, fontWeight:500 }}>{bot}</p>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div style={{ padding:'20px 22px 0', flex:1, position:'relative', zIndex:2 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
            {HIGHLIGHTS.map((h, i) => (
              <div key={h.title} className={`fu${i+5}`} style={{
                borderRadius:'var(--radius-md)',
                border:'1px solid var(--border)',
                background:'var(--surface)',
                padding:'14px 16px',
                display:'flex', alignItems:'flex-start', gap:13,
                transition:'border-color .22s, transform .22s, box-shadow .22s',
              }}
              onTouchStart={e => {
                e.currentTarget.style.borderColor = `rgba(${h.accentRgb},0.3)`
                e.currentTarget.style.transform = 'scale(0.985)'
              }}
              onTouchEnd={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = ''
              }}
              >
                <div style={{
                  width:40, height:40, borderRadius:12, flexShrink:0,
                  background:`rgba(${h.accentRgb},0.10)`, border:`1px solid rgba(${h.accentRgb},0.22)`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
                }}>{h.icon}</div>
                <div>
                  <p style={{ fontFamily:'var(--font-disp)', fontSize:14, fontWeight:700, letterSpacing:'-0.028em', color:'var(--text)' }}>{h.title}</p>
                  <p style={{ fontSize:12.5, color:'var(--text2)', marginTop:3, lineHeight:1.55, fontWeight:400 }}>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding:'24px 22px 38px', position:'relative', zIndex:2 }}>
          <div style={{ marginBottom: 14 }}>
            <DownloadButton mobile />
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="shimmer-btn"
            style={{
              width:'100%', padding:'16px 20px',
              background:'linear-gradient(135deg,#FACC15 0%,#F0A800 100%)',
              color:'#09090A', border:'none',
              borderRadius:'var(--radius-md)',
              fontSize:15.5, fontWeight:800, letterSpacing:'-0.025em',
              position:'relative', overflow:'hidden',
              boxShadow:'0 8px 32px rgba(250,204,21,0.22)',
              transition:'transform .15s, box-shadow .15s',
            }}
            onMouseDown={e => e.currentTarget.style.transform='scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform=''}
            onTouchStart={e => e.currentTarget.style.transform='scale(0.97)'}
            onTouchEnd={e => e.currentTarget.style.transform=''}
          >
            Start studying for free →
          </button>
          <p style={{
            textAlign:'center', fontSize:11.5, color:'var(--text3)',
            marginTop:11, fontWeight:500, letterSpacing:'0.01em',
          }}>
            No credit card · Sign in on the next screen
          </p>
        </div>

      </div>
    </>
  )
}


/* ═══════════════════════════════════════
   DESKTOP
═══════════════════════════════════════ */
function DesktopLanding({ navigate }) {
  const [active, setActive] = useState(null)

  return (
    <>
      <style>{GLOBAL_CSS + `
        .d-root { min-height:100vh; background:var(--bg); overflow-x:hidden; position:relative; }

        .d-nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 60px; height:66px;
          background:rgba(8,9,10,0.78);
          backdrop-filter:blur(22px) saturate(1.5);
          border-bottom:1px solid var(--border);
        }
        .d-nav-logo { display:flex; align-items:center; gap:12px; }
        .d-nav-center {
          position:absolute; left:50%; transform:translateX(-50%);
          display:flex; gap:38px;
        }
        .d-nav-center a {
          font-family:var(--font-body); font-size:13.5px; color:var(--text2);
          text-decoration:none; font-weight:500; letter-spacing:-0.01em;
          transition:color .18s;
        }
        .d-nav-center a:hover { color:var(--text); }

        .d-hero {
          display:grid; grid-template-columns:1fr 1fr;
          align-items:center; gap:64px;
          min-height:100vh; padding:88px 80px 72px;
          max-width:1300px; margin:0 auto; position:relative; z-index:1;
        }

        .d-cards {
          display:grid; grid-template-columns:repeat(3,1fr); gap:16px;
          padding:0 80px 100px; max-width:1300px; margin:0 auto;
          position:relative; z-index:1;
        }
        .d-card {
          border-radius:var(--radius-lg); border:1px solid var(--border);
          background:var(--surface); padding:28px 24px;
          transition:transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s, border-color .28s;
        }
        .d-card:hover { transform:translateY(-7px); box-shadow:0 24px 64px rgba(0,0,0,0.6); }

        .d-visual {
          position:relative; height:520px;
          display:flex; align-items:center; justify-content:center;
        }
        .d-ring {
          position:absolute; border-radius:50%;
          top:50%; left:50%; transform:translate(-50%,-50%);
        }
        .d-center {
          width:106px; height:106px; border-radius:28px; z-index:2; position:relative;
          background:linear-gradient(145deg,#1E1F2A,#101014);
          border:1px solid rgba(250,204,21,0.26);
          display:flex; align-items:center; justify-content:center; font-size:46px;
          box-shadow:0 0 0 1px rgba(250,204,21,0.06), 0 28px 64px rgba(0,0,0,0.75);
          animation:float 5.5s ease-in-out infinite, borderGlow 4s ease-in-out infinite;
        }
        .d-floatcard {
          position:absolute; border-radius:18px;
          background:var(--surface2); border:1px solid var(--border2);
          box-shadow:0 20px 56px rgba(0,0,0,0.72); padding:16px 18px;
        }
        .d-footer {
          text-align:center; padding:0 0 60px;
          font-size:12.5px; color:var(--text3); line-height:1.7;
          max-width:580px; margin:0 auto; position:relative; z-index:1;
          font-family:var(--font-body);
        }

        @media(max-width:940px){
          .d-hero{grid-template-columns:1fr;padding:100px 40px 60px;}
          .d-visual{display:none;}
          .d-cards{grid-template-columns:1fr;padding:0 40px 60px;}
          .d-nav{padding:0 32px;}
          .d-nav-center{display:none;}
        }
      `}</style>

      <div className="d-root grain">

        {/* Blobs */}
        {[
          {w:720,h:720,t:-220,l:-220,c:'rgba(250,204,21,0.05)'},
          {w:500,h:500,b:0,r:-160,c:'rgba(129,140,248,0.04)'},
          {w:380,h:380,t:'38%',r:'8%',c:'rgba(52,211,153,0.03)'},
        ].map((b,i) => (
          <div key={i} style={{
            position:'fixed', borderRadius:'50%', pointerEvents:'none', zIndex:0,
            filter:'blur(100px)', width:b.w, height:b.h,
            top:b.t, left:b.l, bottom:b.b, right:b.r,
            background:`radial-gradient(circle,${b.c} 0%,transparent 70%)`,
          }}/>
        ))}

        {/* Nav */}
        <nav className="d-nav fu1">
          <div className="d-nav-logo">
            <div style={{
              width:36, height:36, borderRadius:11,
              background:'linear-gradient(145deg,#1C1C24,#101014)',
              border:'1px solid rgba(250,204,21,0.2)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
            }}>🐝</div>
            <span style={{ fontFamily:'var(--font-disp)', fontWeight:800, fontSize:17.5, letterSpacing:'-0.04em' }}>VidBee</span>
          </div>
          <div className="d-nav-center">
            {[].map(l => <a key={l} href="#">{l}</a>)}
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <button onClick={() => navigate('/auth')} style={{
              background:'transparent', border:'1px solid var(--border2)',
              color:'var(--text2)', borderRadius:10, padding:'8px 18px',
              fontSize:13, fontWeight:600, letterSpacing:'-0.01em', fontFamily:'var(--font-body)',
              transition:'color .18s, border-color .18s',
            }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--text)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--text2)'}
            >Sign in</button>
            <button onClick={() => navigate('/auth')} className="shimmer-btn" style={{
              background:'linear-gradient(135deg,#FACC15,#F0A800)',
              color:'#09090A', border:'none', borderRadius:10, padding:'9px 20px',
              fontSize:13.5, fontWeight:800, letterSpacing:'-0.025em',
              position:'relative', overflow:'hidden',
              boxShadow:'0 4px 20px rgba(250,204,21,0.2)',
              transition:'transform .15s, box-shadow .15s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(250,204,21,0.32)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 20px rgba(250,204,21,0.2)'}}
            >Get started free</button>
          </div>
        </nav>

        {/* Hero */}
        <div className="d-hero">
          <div>
            <div className="fu2" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(250,204,21,0.07)', border:'1px solid rgba(250,204,21,0.18)',
              borderRadius:100, padding:'6px 14px 6px 10px', marginBottom:30,
            }}>
              <span style={{
                width:7, height:7, borderRadius:'50%', background:'var(--yellow)',
                display:'inline-block', boxShadow:'0 0 10px rgba(250,204,21,0.9)',
                animation:'pulse 2.4s ease-in-out infinite',
              }}/>
              <span style={{ fontSize:11.5, color:'var(--yellow)', fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', fontFamily:'var(--font-body)' }}>
                AI-powered quiz generator
              </span>
            </div>

            <h1 className="fu3" style={{
              fontFamily:'var(--font-disp)',
              fontSize:'clamp(46px,4.8vw,76px)',
              fontWeight:800, lineHeight:0.95, letterSpacing:'-0.055em',
              marginBottom:26,
            }}>
              Study smarter.<br/>
              Score higher.<br/>
              <span style={{
                background:'linear-gradient(135deg,#FACC15 0%,#F59E0B 45%,#FACC15 100%)',
                backgroundSize:'200% 200%', animation:'gradShift 4s ease infinite',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              }}>Stress less.</span>
            </h1>

            <p className="fu4" style={{
              fontSize:17, color:'var(--text2)', lineHeight:1.72,
              maxWidth:460, marginBottom:38, fontWeight:400,
              letterSpacing:'-0.01em', fontFamily:'var(--font-body)',
            }}>
              Upload your lecture notes, slides, or textbook chapters — VidBee instantly builds a personalized practice quiz tailored to your exam format.
            </p>

            <div className="fu5" style={{ display:'flex', gap:14, alignItems:'center', marginBottom:44 }}>
              <button onClick={() => navigate('/auth')} className="shimmer-btn" style={{
                background:'linear-gradient(135deg,#FACC15,#F0A800)',
                color:'#09090A', border:'none',
                borderRadius:'var(--radius-md)', padding:'15px 36px',
                fontFamily:'var(--font-disp)', fontWeight:800,
                fontSize:16, letterSpacing:'-0.025em',
                position:'relative', overflow:'hidden',
                boxShadow:'0 8px 32px rgba(250,204,21,0.24)',
                transition:'transform .15s, box-shadow .15s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 16px 44px rgba(250,204,21,0.38)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 32px rgba(250,204,21,0.24)'}}
              onMouseDown={e=>e.currentTarget.style.transform='scale(0.97)'}
              onMouseUp={e=>e.currentTarget.style.transform='translateY(-2px)'}
              >
                Start for free →
              </button>
              <DownloadButton />
              <div>
                <p style={{ fontSize:13, color:'var(--text2)', fontWeight:500, fontFamily:'var(--font-body)', letterSpacing:'-0.01em' }}>No credit card needed</p>
                <p style={{ fontSize:12, color:'var(--text3)', fontWeight:400, fontFamily:'var(--font-body)' }}>Free forever on basic plan</p>
              </div>
            </div>

            {/* Proof strip */}
            <div className="fu6" style={{
              display:'flex', borderTop:'1px solid var(--border)', paddingTop:26, gap:0,
            }}>
              {[
                ['⚡ < 10s','quiz generation'],
                ['🎯 Exam-style','question formats'],
                ['📄 Any format','PDF, slides, notes'],
              ].map(([bold,sub],i) => (
                <div key={i} style={{
                  flex:1, paddingRight:24,
                  borderRight: i<2 ? '1px solid var(--border)' : 'none',
                  marginRight: i<2 ? 24 : 0,
                }}>
                  <p style={{ fontFamily:'var(--font-disp)', fontSize:13.5, fontWeight:700, letterSpacing:'-0.025em', color:'var(--text)' }}>{bold}</p>
                  <p style={{ fontSize:12, color:'var(--text3)', marginTop:2, fontWeight:400, fontFamily:'var(--font-body)' }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="d-visual fu3">
            <div className="d-ring" style={{ width:370, height:370, border:'1px dashed rgba(255,255,255,0.04)' }}/>
            <div className="d-ring" style={{ width:258, height:258, border:'1px dashed rgba(255,255,255,0.05)' }}/>
            <div className="d-ring" style={{ width:160, height:160, border:'1px solid rgba(250,204,21,0.07)' }}/>

            {[
              { icon:'📄', delay:'0s',    r:185, dur:'16s', },
              { icon:'✅', delay:'-5.3s', r:185, dur:'16s', },
              { icon:'🎓', delay:'-10.6s',r:185, dur:'16s', },
            ].map((o,i) => (
              <div key={i} style={{
                position:'absolute', top:'50%', left:'50%', width:0, height:0,
                '--r':`${o.r}px`,
                animation:`orbit ${o.dur} linear ${o.delay} infinite`,
              }}>
                <div style={{
                  width:48, height:48, marginLeft:-24, marginTop:-24,
                  borderRadius:14, background:'var(--surface2)', border:'1px solid var(--border2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:21, boxShadow:'0 8px 28px rgba(0,0,0,0.65)',
                }}>{o.icon}</div>
              </div>
            ))}

            <div className="d-center">🐝</div>

            {/* Floating card – Quiz ready */}
            <div className="d-floatcard" style={{
              bottom:56, right:-10, width:215,
              animation:'floatAlt 6s ease-in-out 0.5s infinite',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:11 }}>
                <div style={{
                  width:30, height:30, borderRadius:9,
                  background:'rgba(250,204,21,0.11)', border:'1px solid rgba(250,204,21,0.22)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:14,
                }}>⚡</div>
                <div>
                  <p style={{ fontFamily:'var(--font-disp)', fontSize:13, fontWeight:700, letterSpacing:'-0.02em' }}>Quiz ready!</p>
                  <p style={{ fontSize:10.5, color:'var(--text3)', fontFamily:'var(--font-body)' }}>from Notes.pdf</p>
                </div>
              </div>
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:9, padding:'9px 11px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                  <span style={{ fontSize:10.5, color:'var(--text2)', fontFamily:'var(--font-body)' }}>Progress</span>
                  <span style={{ fontSize:10.5, color:'var(--text2)', fontFamily:'var(--font-body)' }}>8 / 12</span>
                </div>
                <div style={{ height:4, borderRadius:100, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                  <div style={{ width:'66%', height:'100%', background:'linear-gradient(90deg,#FACC15,#F59E0B)', borderRadius:100 }}/>
                </div>
              </div>
            </div>

            {/* Floating accuracy badge */}
            <div className="d-floatcard" style={{
              top:68, left:-8, width:162,
              animation:'floatAlt 7s ease-in-out 1.5s infinite',
            }}>
              <p style={{ fontSize:10.5, color:'var(--text3)', marginBottom:5, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'var(--font-body)' }}>Accuracy</p>
              <p style={{ fontFamily:'var(--font-disp)', fontSize:32, fontWeight:800, letterSpacing:'-0.05em', color:'var(--yellow)', lineHeight:1 }}>84%</p>
              <p style={{ fontSize:11.5, color:'var(--text3)', marginTop:4, fontFamily:'var(--font-body)' }}>↑ 12% from last quiz</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="d-cards">
          {HIGHLIGHTS.map((h,i) => (
            <div key={h.title} className={`d-card fu${i+5}`}
              style={{ borderColor: active===i ? `rgba(${h.accentRgb},0.28)` : 'var(--border)' }}
              onMouseEnter={()=>setActive(i)}
              onMouseLeave={()=>setActive(null)}
            >
              <div style={{
                width:52, height:52, borderRadius:15, marginBottom:20, fontSize:23,
                background:`rgba(${h.accentRgb},0.09)`, border:`1px solid rgba(${h.accentRgb},0.22)`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>{h.icon}</div>
              <h3 style={{
                fontFamily:'var(--font-disp)', fontSize:18, fontWeight:800,
                letterSpacing:'-0.035em', marginBottom:10, color:'var(--text)',
              }}>{h.title}</h3>
              <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.67, fontWeight:400, fontFamily:'var(--font-body)' }}>{h.desc}</p>
            </div>
          ))}
        </div>

        <p className="d-footer">
          Results vary by document quality and course. VidBee is an independent product and is not affiliated with any university or institution.
        </p>

        <a className="d-footer-link flex justify-center" href="https://t.me/Purpleew_eed">Developer</a>

        <footer style={{
          padding: '40px 22px 30px',
          position: 'relative', zIndex: 2,
          display:'flex', flexDirection:'column', alignItems:'center',
          gap: 12,
        }}>
          <p style={{ fontSize:12, color:'var(--text3)', fontFamily:'var(--font-body)', textAlign:'center' }}>© 2026 VidBee. All rights reserved.</p>
        </footer>


      </div>
    </>
  )
}


/* ═══════════════════════════════════════
   ROOT
═══════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate()
  const { isMobile } = usePlatform()

  if (!isMobile) return <DesktopLanding navigate={navigate} />
  return <MobileLanding navigate={navigate} />
}