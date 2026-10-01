import re
with open("src/pages/monitoring/PainMapPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = r"""  const handlePartClick = \(part\) => \{
    setSelectedPart\(part\);
    if \(records\[part\.id\]\) \{
      setPainData\(records\[part\.id\]\);
    \} else \{
      setPainData\(\{ intensity: 5, pain_type: 'Muscular', notes: '' \}\);
    \}
  \};"""

replacement = """  const handlePartClick = (part) => {
    setSelectedPart(part);
    if (records[part.id]) {
      setPainData(records[part.id]);
    } else {
      setPainData({ intensity: 5, pain_type: 'Muscular', notes: '' });
    }
    
    setTimeout(() => {
      if (formRef.current) {
        try {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch(e) {
          formRef.current.scrollIntoView();
        }
      }
    }, 300);
  };"""

data = re.sub(target, replacement, data)

with open("src/pages/monitoring/PainMapPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)
