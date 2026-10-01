import re
with open("src/pages/monitoring/PainMapPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = r"""    setTimeout\(\(\) => \{
      if \(formRef\.current\) \{
        try \{
          formRef\.current\.scrollIntoView\(\{ behavior: 'smooth', block: 'center' \}\);
        \} catch\(e\) \{
          formRef\.current\.scrollIntoView\(\);
        \}
      \}
    \}, 300\);"""

replacement = """    setTimeout(() => {
      if (formRef.current) {
        try {
          const y = formRef.current.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        } catch(e) {
          formRef.current.scrollIntoView();
        }
      }
    }, 150);"""

data = re.sub(target, replacement, data)

with open("src/pages/monitoring/PainMapPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)
