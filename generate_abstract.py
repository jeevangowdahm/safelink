"""Generate SafeLink Abstract Document in DOCX format."""
# pyrefly: ignore [missing-import]
from docx import Document
# pyrefly: ignore [missing-import]
from docx.shared import Pt, Inches, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

doc = Document()

# --- Page Setup ---
for section in doc.sections:
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(3.18)
    section.right_margin = Cm(3.18)

style = doc.styles['Normal']
style.font.name = 'Times New Roman'
style.font.size = Pt(12)
style.paragraph_format.line_spacing = 1.5

# --- Helper ---
def add_heading_centered(text, level=1, bold=True):
    h = doc.add_heading(text, level=level)
    h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for run in h.runs:
        run.font.name = 'Times New Roman'
        run.font.color.rgb = RGBColor(0, 0, 0)
        run.bold = bold
    return h

def add_para(text, bold=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY, size=12, spacing_after=6):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_after = Pt(spacing_after)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(size)
    run.bold = bold
    return p

def add_field(label, value):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_after = Pt(8)
    r1 = p.add_run(label + ': ')
    r1.font.name = 'Times New Roman'
    r1.font.size = Pt(12)
    r1.bold = True
    r2 = p.add_run(value)
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(12)
    return p

# ========== DOCUMENT CONTENT ==========

# Header
add_para('FORM OF ABSTRACT', bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, size=14, spacing_after=4)
add_para('(Section 10, Rule 13)', align=WD_ALIGN_PARAGRAPH.CENTER, size=10, spacing_after=16)

doc.add_paragraph().add_run('').font.size = Pt(6)  # spacer

# Title
add_field('Title of the Invention',
          'SafeLink — An AI-Powered Multi-Modal Emergency Response Progressive Web Application for Urban Women\'s Safety')

doc.add_paragraph().add_run('').font.size = Pt(6)

# Field
add_field('Field of the Invention',
          'The present invention relates to the field of Artificial Intelligence-driven public safety systems, '
          'and more particularly to a Progressive Web Application (PWA) that integrates real-time threat analysis, '
          'geospatial crime heatmap visualization, accelerometer-based panic triggering, and automated multi-channel '
          'emergency notification for enhancing the personal safety of women in urban environments.')

doc.add_paragraph().add_run('').font.size = Pt(6)

# Applicant
add_field('Name(s) of Applicant(s)', '[Applicant Name(s) — To Be Filled]')
add_field('Address of Applicant(s)', '[Address — To Be Filled]')

doc.add_paragraph().add_run('').font.size = Pt(6)

# Abstract heading
add_heading_centered('ABSTRACT', level=2)

# Abstract body
abstract_text = (
    "The present invention discloses a system and method for an AI-powered emergency response platform, "
    "designated as \"SafeLink,\" implemented as a Progressive Web Application (PWA) specifically engineered "
    "for urban women's safety in metropolitan environments. The system provides a unified platform that "
    "consolidates six critical safety functionalities into a single, zero-installation, browser-accessible "
    "application.\n\n"
    
    "The invention comprises: (a) a one-tap SOS activation mechanism with an auto-countdown timer that "
    "simultaneously transmits the user's real-time GPS coordinates, medical profile (including blood group, "
    "allergies, and pre-existing conditions), and emergency contact information to a pre-configured set of "
    "up to five emergency contacts via SMS using the Fast2SMS API gateway, while concurrently initiating "
    "an automatic voice call to the primary emergency contact or the national emergency number (112); "
    "(b) a multi-provider Artificial Intelligence threat analysis engine, powered by Google Gemini 2.0 Flash "
    "and Groq Llama 3.3 70B large language models in a cascading fallback architecture with a deterministic "
    "local mock layer, capable of classifying user-described emergency situations into LOW, MEDIUM, or CRITICAL "
    "severity levels and recommending context-specific helplines and actions within sub-two-second response times; "
    "(c) an interactive geospatial safety heatmap built on Leaflet.js and OpenStreetMap with a leaflet.heat "
    "overlay, visualizing crime density across 20+ geo-referenced zones within the target metropolitan area, "
    "enabling users to assess neighbourhood risk levels and make informed route decisions; "
    "(d) a device-accelerometer-based shake detection module that monitors the DeviceMotion API for three "
    "consecutive shake events exceeding a configurable acceleration threshold of 30 m/s², enabling zero-UI "
    "SOS activation from within a pocket or bag, complemented by a triple-keystroke (\"S\" key) panic shortcut "
    "for desktop environments; "
    "(e) a configurable fake incoming call simulator with selectable caller identities (Mom, Dad, Boss, Roommate), "
    "adjustable delay timers (3–30 seconds), realistic vibration patterns via the Vibration API, and an active "
    "call timer display, enabling discreet extrication from unsafe social situations; and "
    "(f) a timed safety check-in system where missed check-ins automatically trigger emergency notifications "
    "to designated contacts.\n\n"
    
    "The system architecture follows a client-server model with a React 19 / Vite 8 frontend communicating "
    "with a Node.js / Express.js backend, persisted by a Supabase (PostgreSQL) database with Row-Level Security "
    "policies. The application leverages native Web APIs including the Geolocation API, DeviceMotion API, "
    "Web Speech API (for voice-to-text input), Vibration API, and the Notifications API. The invention addresses "
    "a critical gap in the existing prior art by combining AI-driven contextual threat analysis, geospatial "
    "intelligence, multi-modal panic triggering, and automated emergency response into a single, lightweight, "
    "cross-platform PWA that requires no app store installation, thereby minimizing response latency in "
    "life-threatening situations."
)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
p.paragraph_format.space_after = Pt(12)
p.paragraph_format.line_spacing = 1.5
run = p.add_run(abstract_text)
run.font.name = 'Times New Roman'
run.font.size = Pt(12)

# Signature block
doc.add_paragraph().add_run('').font.size = Pt(24)  # spacer

add_para('Date: _______________', align=WD_ALIGN_PARAGRAPH.LEFT, spacing_after=12)
add_para('Signature of Applicant(s): _______________', align=WD_ALIGN_PARAGRAPH.LEFT, spacing_after=12)
add_para('Name of Applicant(s): _______________', align=WD_ALIGN_PARAGRAPH.LEFT, spacing_after=12)

# Save
output_path = r'c:\Users\Kethan NU\Desktop\hacks\SafeLink_Abstract_Document.docx'
doc.save(output_path)
print(f'Abstract document saved to: {output_path}')
