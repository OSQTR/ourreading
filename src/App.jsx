import React, { useEffect, useState } from "react";
import BibleViewer from "./BibleViewer";

const App = () => {
  const [bibleData, setBibleData] = useState(null);

  useEffect(() => {
    fetch("/bible_korean_optimized.json")
      .then((res) => res.json())
      .then((data) => setBibleData(data));
  }, []);

  return <BibleViewer bibleData={bibleData} />;
};

export default App;
