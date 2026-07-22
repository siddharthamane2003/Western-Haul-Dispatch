import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LOGO = '/western-haul-logo.jpg'

const NAV_LINKS = ['Home', 'Features', 'About', 'Contact']

const FEATURES = [
  { icon: '🚛', title: 'Trip Management', desc: 'Create and manage freight trips with all details — broker, load number, amount and payment type.' },
  { icon: '📍', title: 'Multi-Stop Routing', desc: 'Add multiple pickup, delivery, cross-dock and yard stops with time windows and commodity info.' },
  { icon: '👤', title: 'Driver Assignment', desc: 'Assign drivers and co-drivers, select truck and trailer for every dispatch instantly.' },
  { icon: '📱', title: 'WhatsApp Share', desc: 'Instantly share professionally formatted dispatch summaries to any WhatsApp group or contact.' },
  { icon: '📊', title: 'Reports & Analytics', desc: 'Track total dispatches, monthly revenue, pending and completed deliveries in real time.' },
  { icon: '🔒', title: 'Secure Access', desc: 'Role-based access control ensures your data is safe and accessible only to authorized users.' },
  { icon: '📄', title: 'PDF Download', desc: 'Download a professional PDF of any dispatch summary for record-keeping and billing.' },
  { icon: '🖨️', title: 'Print Ready', desc: 'Print any dispatch detail or summary directly from your browser with one click.' },
]

const STATS = [
  { value: '500+', label: 'Dispatches Created' },
  { value: '50+', label: 'Drivers Managed' },
  { value: '100%', label: 'Uptime Guarantee' },
  { value: '24/7', label: 'Support Available' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSent, setContactSent] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    setContactSent(true)
    setContactForm({ name: '', email: '', message: '' })
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a', overflowX: 'hidden' }}>

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e8e8e8',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => scrollTo('home')}>
          <img src={LOGO} alt="Western Haul Dispatch" style={{ height: '44px', width: '44px', objectFit: 'contain', borderRadius: '6px' }} />
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#1a2744', lineHeight: 1.1 }}>WESTERN HAUL</p>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: '600', color: '#b8952a', letterSpacing: '0.15em' }}>DISPATCH</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => scrollTo(link.toLowerCase())}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '600', color: '#444',
                  padding: '0', transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a2744')}
                onMouseLeave={e => (e.currentTarget.style.color = '#444')}
              >{link}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/login')} style={{
              padding: '8px 20px', background: '#1a2744',
              border: '1.5px solid #1a2744', borderRadius: '8px',
              fontSize: '13px', fontWeight: '700', color: '#fff', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0d1b3e' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a2744' }}
            >Login</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section id="home" style={{
        background: 'linear-gradient(135deg, #0d1b3e 0%, #1a2744 50%, #0d1b3e 100%)',
        padding: '80px 24px 100px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(184,149,42,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(184,149,42,0.06)', pointerEvents: 'none' }} />

        {/* Logo large */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <img src={LOGO} alt="Western Haul Dispatch Logo"
            style={{ height: '100px', width: '100px', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} />
        </div>

        <div style={{
          display: 'inline-block', background: 'rgba(184,149,42,0.15)', border: '1px solid rgba(184,149,42,0.3)',
          borderRadius: '20px', padding: '4px 16px', marginBottom: '20px',
        }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#b8952a', letterSpacing: '0.1em' }}>
            🚛 PROFESSIONAL DISPATCH MANAGEMENT
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: '900', color: '#ffffff',
          margin: '0 0 20px', lineHeight: 1.15, maxWidth: '750px', marginInline: 'auto',
        }}>
          Manage Your Dispatch<br />
          <span style={{ color: '#b8952a' }}>Operations</span> with Ease
        </h1>

        <p style={{
          fontSize: 'clamp(14px, 2vw, 18px)', color: 'rgba(255,255,255,0.75)',
          maxWidth: '580px', margin: '0 auto 36px', lineHeight: 1.7,
        }}>
          The complete logistics dispatch management platform. Track trips, assign drivers,
          and share summaries instantly via WhatsApp.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/login')} style={{
            padding: '14px 32px', background: '#b8952a',
            border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '800', color: '#fff', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(184,149,42,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(184,149,42,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(184,149,42,0.4)' }}
          >Login 🚀</button>
          <button onClick={() => scrollTo('features')} style={{
            padding: '14px 32px', background: 'transparent',
            border: '2px solid rgba(255,255,255,0.4)', borderRadius: '10px',
            fontSize: '15px', fontWeight: '700', color: '#fff', cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
          >Learn More</button>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────── */}
      <section style={{
        background: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '28px 24px',
        display: 'flex', justifyContent: 'center', gap: '0', flexWrap: 'wrap',
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{
            textAlign: 'center', padding: '12px 40px',
            borderRight: i < STATS.length - 1 ? '1px solid #e8e8e8' : 'none',
            minWidth: '150px',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '900', color: '#1a2744' }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section id="features" style={{ padding: '72px 24px', background: '#f8f9fb' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#b8952a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Features</p>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: '900', color: '#1a2744', margin: '0 0 12px' }}>Everything You Need</h2>
            <p style={{ fontSize: '15px', color: '#666', maxWidth: '480px', margin: '0 auto' }}>
              A complete toolkit for managing your freight dispatch operations efficiently.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: '#fff', borderRadius: '14px', padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1a2744, #0d1b3e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', marginBottom: '16px',
                }}>{f.icon}</div>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '800', color: '#1a2744' }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────── */}
      <section id="about" style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '48px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 auto' }}>
            <img src={LOGO} alt="Western Haul Dispatch"
              style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} />
          </div>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#b8952a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>About Us</p>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: '900', color: '#1a2744', margin: '0 0 16px' }}>About Western Haul Dispatch</h2>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, marginBottom: '16px' }}>
              Western Haul Dispatch is a professional dispatch management platform built for modern logistics
              companies. We streamline your operations from trip creation to delivery confirmation —
              making dispatching faster, smarter, and more reliable.
            </p>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, marginBottom: '20px' }}>
              Our platform connects freight brokers, drivers, and dispatchers in one seamless workflow,
              with real-time WhatsApp sharing, PDF generation, and full dispatch history tracking.
            </p>
            <p style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>
              Developed with Love and Care 💙 — Techno Creators Inc.
            </p>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ───────────────────────────────────── */}
      <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, #0d1b3e, #1a2744)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: '900', color: '#fff', marginBottom: '12px' }}>Simple Workflow</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '40px', fontSize: '14px' }}>From dispatch creation to WhatsApp sharing in minutes</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0' }}>
            {['Create Trip', 'Add Stops', 'Assign Driver', 'Generate Summary', 'Share via WhatsApp'].map((step, i) => (
              <React.Fragment key={step}>
                <div style={{
                  background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 20px',
                  border: '1px solid rgba(255,255,255,0.15)', minWidth: '110px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                    {['📝', '📍', '👤', '📋', '📱'][i]}
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#fff' }}>{step}</p>
                </div>
                {i < 4 && <div style={{ fontSize: '20px', color: '#b8952a', padding: '0 8px', fontWeight: '900' }}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────── */}
      <section id="contact" style={{ padding: '72px 24px', background: '#f8f9fb' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#b8952a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Contact</p>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: '900', color: '#1a2744', margin: '0 0 8px' }}>Get In Touch</h2>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Have questions? We'd love to hear from you.</p>
          </div>

          {contactSent ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <h3 style={{ color: '#22c55e', marginBottom: '8px' }}>Message Sent!</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <form onSubmit={handleContact}>
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>{f.label}</label>
                    <input type={f.type} required placeholder={f.placeholder}
                      value={(contactForm as any)[f.key]}
                      onChange={e => setContactForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8f9fb' }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>Message</label>
                  <textarea required placeholder="Your message..." value={contactForm.message}
                    onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8f9fb', minHeight: '120px', resize: 'vertical' }}
                  />
                </div>
                <button type="submit" style={{
                  width: '100%', padding: '13px', background: '#1a2744',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                }}>Send Message</button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{
        background: '#0d1b3e', color: 'rgba(255,255,255,0.6)',
        padding: '32px 24px', textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <img src={LOGO} alt="Logo" style={{ height: '36px', width: '36px', objectFit: 'contain', borderRadius: '4px' }} />
          <span style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>Western Haul Dispatch</span>
        </div>
        <p style={{ margin: '0 0 8px', fontSize: '13px' }}>
          © 2026 Western Haul Dispatch. All rights reserved.
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
          Powered by Techno Creators Inc. — Developed with Love and Care 💙
        </p>
      </footer>
    </div>
  )
}
