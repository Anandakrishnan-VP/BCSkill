import base64

text = """# SkillVoice Design System

A minimalistic, clean, and industry-grade design system for a voice-first upskilling platform.

## Color Palette
- Primary Color: A deep, trustworthy blue (e.g., #2563EB).
- Secondary Color: Crisp white (#FFFFFF) and light gray (#F8FAFC) for backgrounds.
- Success Color: Emerald green (#10B981) for progress and passing assessments.
- Warning Color: Amber (#F59E0B) for in-progress states.
- Danger Color: Rose (#F43F5E) for failed states or warnings.

## Typography
- Font Family: 'Inter', sans-serif. Clean, highly legible, modern.
- Headers: Bold, clear, minimalistic.
- Body: Simple, avoiding large blocks of text.

## Shape & UI Elements
- Large, touch-friendly targets (minimum 60px height).
- Rounded corners for a modern feel (e.g., 12px or 16px radius).
- Subtle drop shadows for depth, avoiding flat "old style" looks but keeping it clean (glassmorphism touches where appropriate).

## General Vibe
- Minimalistic: Avoid clutter, use ample white space.
- Professional & Industry-grade: Looks like a polished enterprise tool tailored for blue-collar workers.
- Icon-heavy: Rely on large, clear icons and visuals instead of text."""

print(base64.b64encode(text.encode('utf-8')).decode('utf-8'))
