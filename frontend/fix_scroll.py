# coding: utf-8
import re

with open("src/pages/monitoring/PainMapPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = r"""    setTimeout\(\(\) => \{
      if \(formRef\.current\) \{
        try \{
          const y = formRef\.current\.getBoundingClientRect\(\)\.top \+ window\.scrollY - 100;
          window\.scrollTo\(\{ top: y, behavior: 'smooth' \}\);
        \} catch\(e\) \{
          formRef\.current\.scrollIntoView\(\);
        \}
      \}
    \}, 150\);"""

replacement = """    setTimeout(() => {
      if (formRef.current) {
        const scrollContainer = document.querySelector('main');
        
        if (scrollContainer) {
          const elementRect = formRef.current.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          
          const targetY = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - 20;
          
          try {
            scrollContainer.scrollTo({ top: targetY, behavior: 'smooth' });
          } catch(e) {
            scrollContainer.scrollTop = targetY;
          }
        } else {
          try {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch(e) {
            formRef.current.scrollIntoView();
          }
        }
      }
    }, 250);"""

data = re.sub(target, replacement, data)

with open("src/pages/monitoring/PainMapPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)
