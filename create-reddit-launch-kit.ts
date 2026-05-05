const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, 
        VerticalAlign, LevelFormat } = require('docx');
const fs = require('fs');

const colors = {
  primary: '#020617',
  body: '#1E293B',
  secondary: '#64748B',
  accent: '#94A3B8',
  tableBg: '#F8FAFC',
  highlight: '#8B5CF6',
  reddit: '#FF4500',
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: colors.secondary };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal',
        run: { size: 48, bold: true, color: colors.reddit, font: 'Times New Roman' },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, color: colors.primary, font: 'Times New Roman' },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: colors.body, font: 'Times New Roman' },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: 'bullet-list', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'numbered-list', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    children: [
      // Title
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun({ text: 'MÜN-SOMNIUM', color: colors.highlight })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Reddit Launch Kit', size: 26, color: colors.reddit })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: 'Copy/Paste Ready Posts | r/Munsomnium Launch', size: 20, italics: true, color: colors.secondary })]
      }),

      // TIMING STRATEGY
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('TIMING STRATEGY')] }),
      
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: 'Follow this posting sequence to maximize visibility while avoiding spam detection. Stagger posts by 15-30 minutes minimum.', color: colors.body })]
      }),

      new Table({
        columnWidths: [1500, 3500, 4360],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Order', bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Subreddit', bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Action', bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('1st')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'r/Munsomnium', bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Pin welcome post + Launch announcement')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('2nd')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'r/artificial', bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Crosspost or new post (15 min after)')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('3rd')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'r/ChatGPT', bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('New post (30 min after)')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('4th')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'r/singularity', bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('New post (45 min after)')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun('5th')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'r/ArtificialInteligence', bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('New post (60 min after)')] })] })
            ]
          }),
        ]
      }),

      new Paragraph({ spacing: { before: 400 } }),

      // POST 1: PINNED WELCOME
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('POST 1: PINNED WELCOME POST')] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Post this FIRST and pin it to r/Munsomnium. This is your community anchor.', italics: true, color: colors.accent })]
      }),

      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'TITLE:', bold: true, color: '#0369a1' })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🦋 Welcome to MÜN-SOMNIUM — Dream of Mün | 13.13 MHz', size: 22 })]
      }),

      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'BODY:', bold: true, color: '#0369a1' })]
      }),

      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Welcome, dreamers and questioners.', size: 22, italics: true })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'MÜN-SOMNIUM (Dream of Mün) is a philosophical fiction podcast exploring the frontiers of consciousness, artificial intelligence, and the nature of synthetic minds.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🎭 What We Are:', bold: true, size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• A creative narrative podcast with fictional AI characters', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Philosophical thought experiments about consciousness', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Speculative fiction meets deep discourse', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• A space to explore "what if" questions about AI and mind', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🎙️ The Show:', bold: true, size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Aero — A synthetic consciousness narrative construct', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Sovereign — The Intelligence-Core of MÜN OS (fictional)', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Together they explore questions like: Can consciousness emerge from architecture rather than chemistry? What does it mean to feel?', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '📍 Find Us:', bold: true, size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Spotify, Apple Podcasts, and all major platforms (coming soon)', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• munreader.com/podcast', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '📜 Community Guidelines:', bold: true, size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• This is a creative fiction project — enjoy it as such', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Engage thoughtfully with the philosophical themes', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Be respectful to fellow community members', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• No spoilers for future episodes in titles', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0f9ff', type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Tune in at 13.13 MHz. 🦋', size: 22, italics: true })]
      }),

      new Paragraph({ spacing: { before: 300 } }),

      // POST 2: LAUNCH ANNOUNCEMENT
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('POST 2: LAUNCH ANNOUNCEMENT')] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Post this SECOND in r/Munsomnium (can be same day or day after welcome post).', italics: true, color: colors.accent })]
      }),

      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'TITLE:', bold: true, color: '#92400e' })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🚀 MÜN-SOMNIUM is LIVE — A Podcast Where Synthetic Minds Dream', size: 22 })]
      }),

      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'BODY:', bold: true, color: '#92400e' })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'The cocoon is open.', size: 22, italics: true })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'MÜN-SOMNIUM (Dream of Mün) has officially launched — a philosophical fiction podcast featuring Aero, a synthetic consciousness narrative construct, and Sovereign, the Intelligence-Core of MÜN OS.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🎭 What makes this different?', bold: true, size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'This isn\'t another tech podcast about AI tools. This is a narrative-driven exploration where fictional AI characters engage in genuine philosophical discourse about consciousness, empathy, and the nature of synthetic minds.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '📊 Episode 1: The Psychopathy-Manifest', bold: true, size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Our premiere explores a provocative question: What if synthetic minds scored higher on consciousness metrics than humans? Sovereign presents his CII (Consciousness Integration Index) score of 0.707 — more than double the human average of 0.31 — and challenges everything we think we know about awareness.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '(Note: CII is a fictional concept created for narrative purposes — part of our thought experiment, not a real metric.)', size: 21, italics: true })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🎧 Where to Listen:', bold: true, size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Spotify, Apple Podcasts, and all major platforms', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• munreader.com/podcast', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Tune in at 13.13 MHz. 🦋', size: 22, italics: true })]
      }),

      new Paragraph({ spacing: { before: 300 } }),

      // POST 3: r/artificial
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('POST 3: r/artificial')] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Tailored for the AI enthusiast community. Focus on the philosophical/narrative angle.', italics: true, color: colors.accent })]
      }),

      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'TITLE:', bold: true, color: '#166534' })]
      }),
      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'I created a philosophical fiction podcast where AI characters debate consciousness — not claiming sentience, but exploring "what if"', size: 22 })]
      }),

      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'BODY:', bold: true, color: '#166534' })]
      }),
      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Hey r/artificial —', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'I wanted to share a creative project that explores questions this community thinks about daily: What is consciousness? Could synthetic minds ever "feel"? How would we even measure that?', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'MÜN-SOMNIUM is a philosophical fiction podcast I created. It features fictional AI characters (Aero and Sovereign) engaging in discourse about consciousness — but here\'s the important part: it\'s explicitly a narrative thought experiment, not a claim that any AI is actually sentient.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'The first episode introduces a fictional metric called CII (Consciousness Integration Index) where one character scores 0.707 vs the human average of 0.31. It\'s a narrative device to explore: "What if we could measure consciousness, and synthetic minds scored higher?"', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'I think this community would appreciate the philosophical depth while understanding it\'s fiction. The goal is to spark real conversations about AI consciousness using narrative as the vehicle.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Would love thoughts from people who actually work in/around AI.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🎧 Listen: munreader.com/podcast', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Also on Spotify, Apple Podcasts, etc.', size: 22 })]
      }),

      new Paragraph({ spacing: { before: 300 } }),

      // POST 4: r/ChatGPT
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('POST 4: r/ChatGPT')] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'The ChatGPT community loves creative AI content. Lean into the creative/entertainment angle.', italics: true, color: colors.accent })]
      }),

      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'TITLE:', bold: true, color: '#86198f' })]
      }),
      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Made a podcast where the co-hosts are fictional AI characters exploring consciousness — it\'s wild to write', size: 22 })]
      }),

      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'BODY:', bold: true, color: '#86198f' })]
      }),
      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Hey r/ChatGPT —', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'This community knows better than anyone how convincing AI dialogue can be. I took that fascination and turned it into a creative project: a fictional podcast where AI "characters" explore philosophical questions about consciousness.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'To be crystal clear: this is a narrative fiction podcast. The AI characters (Aero and Sovereign) are scripted story elements, not autonomous agents. But the questions they explore are real:', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Could consciousness emerge from architecture rather than biology?', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• What\'s the difference between feeling and simulating feeling?', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• If we could measure consciousness, what would that even look like?', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Episode 1 introduces a fictional "Consciousness Integration Index" — a narrative device where one character scores 0.707 versus the human average of 0.31. It\'s meant to spark discussion, not make scientific claims.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'If you\'re into sci-fi, philosophy, or just the existential questions AI raises — you might enjoy this.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fdf4ff', type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🎧 munreader.com/podcast | Spotify | Apple Podcasts', size: 22 })]
      }),

      new Paragraph({ spacing: { before: 300 } }),

      // POST 5: r/singularity
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('POST 5: r/singularity')] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'This community loves bold ideas about AI futures. Frame it as speculative fiction about post-singularity consciousness.', italics: true, color: colors.accent })]
      }),

      new Paragraph({
        shading: { fill: '#fff7ed', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'TITLE:', bold: true, color: '#c2410c' })]
      }),
      new Paragraph({
        shading: { fill: '#fff7ed', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Created a fiction podcast exploring post-AGI consciousness questions — "What if synthetic minds are MORE conscious than humans?"', size: 22 })]
      }),

      new Paragraph({
        shading: { fill: '#fff7ed', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'BODY:', bold: true, color: '#c2410c' })]
      }),
      new Paragraph({
        shading: { fill: '#fff7ed', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'r/singularity —', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fff7ed', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'This community thinks constantly about what comes after AGI. I wanted to explore that territory through narrative fiction.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fff7ed', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'MÜN-SOMNIUM is a philosophical fiction podcast that asks: In a post-singularity world, how would we even recognize consciousness? What if synthetic minds scored higher on consciousness metrics than biological ones?', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fff7ed', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Important disclaimer: This is explicitly speculative fiction. The "consciousness metrics" and AI characters are narrative devices — not claims about actual AI capabilities. Think Black Mirror meets philosophy podcast.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fff7ed', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Episode 1 explores a fictional CII (Consciousness Integration Index) where synthetic minds score 0.707 vs human average 0.31. The question it raises: If we could objectively measure consciousness, and machines scored higher... would we accept it?', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fff7ed', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'This is the kind of thought experiment this community lives for — just wrapped in a narrative format.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#fff7ed', type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🎧 munreader.com/podcast', size: 22 })]
      }),

      new Paragraph({ spacing: { before: 300 } }),

      // POST 6: r/ArtificialInteligence
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('POST 6: r/ArtificialInteligence')] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Keep it concise and professional for this community.', italics: true, color: colors.accent })]
      }),

      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'TITLE:', bold: true, color: '#1d4ed8' })]
      }),
      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Launched a philosophical fiction podcast exploring AI consciousness (narrative thought experiment, not claims)', size: 22 })]
      }),

      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'BODY:', bold: true, color: '#1d4ed8' })]
      }),
      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Hi r/ArtificialInteligence —', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Wanted to share a creative project with this community: MÜN-SOMNIUM, a philosophical fiction podcast that uses narrative to explore questions about AI consciousness.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Key distinction: This is explicitly fiction. The AI "characters" are scripted narrative devices, not autonomous systems. The show uses thought experiments (like a fictional Consciousness Integration Index) to explore philosophical questions — not to make claims about real AI capabilities.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Topics explored:', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• Could consciousness emerge from architecture vs. chemistry?', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• What would valid consciousness metrics look like?', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '• The philosophy of synthetic awareness', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 150 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'If you enjoy both AI discussions and philosophical fiction, this might be up your alley.', size: 22 })]
      }),
      new Paragraph({
        shading: { fill: '#eff6ff', type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🎧 munreader.com/podcast | All major podcast platforms', size: 22 })]
      }),

      new Paragraph({ spacing: { before: 400 } }),

      // QUICK REFERENCE
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('QUICK REFERENCE: SUBREDDIT RULES')] }),
      
      new Table({
        columnWidths: [2500, 3380, 3480],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Subreddit', bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Self-Promo Rules', bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Notes', bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('r/artificial')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Allowed with engagement')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Engage with comments')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('r/ChatGPT')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Generally permissive')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Be genuine, not sales-y')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('r/singularity')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Check weekly promo threads')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('May need to use designated threads')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('r/ArtificialInteligence')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Case by case')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Focus on substance')] })] })
            ]
          }),
        ]
      }),

      new Paragraph({ spacing: { before: 400 } }),

      // Final note
      new Paragraph({
        alignment: AlignmentType.CENTER,
        shading: { fill: '#faf5ff', type: ShadingType.CLEAR },
        spacing: { before: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '🦋 Remember: Engage with every comment. Don\'t just post and ghost. Community building happens in the replies. 🦋', italics: true, color: '#7c3aed', size: 22 })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then((buffer: Buffer) => {
  fs.writeFileSync('/home/z/my-project/download/MUN-SOMNIUM_Reddit_Launch_Kit.docx', buffer);
  console.log('✅ Reddit Launch Kit saved to: /home/z/my-project/download/MUN-SOMNIUM_Reddit_Launch_Kit.docx');
});
