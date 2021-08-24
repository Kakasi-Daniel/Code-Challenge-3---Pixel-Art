import './App.css';
import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';


const colors = [
  'red',
  'purple',
  'greenyellow',
  'blue',
  'yellow',
  'orange',
  'white',
  'black',
  'beige',
  'salmon',
  'brown',
];

function App() {
  const [gridLayout, setGridLayout] = useState(8);
  const [grid, setGrid] = useState([]);
  const [colorsButtons, setColorsButtons] = useState([]);
  const gridRef = useRef();
  const colorStateRef = useRef('red');

  const setColor = (color) => {
    colorStateRef.current = color;
  };

  const downloadArtHandler = () => {
    html2canvas(gridRef.current).then(canvas => {
      let link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'yourPixArt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const changeCellColorHandler = (e) => {
    if (e.target.style.background === colorStateRef.current) {
      e.target.style.background = 'rgb(255,255,255)';
    } else {
      e.target.style.background = colorStateRef.current;
    }
  };

  const changeMainColorHandler = (e) => {
    let colorToChange = '';
    colorToChange = e.target.style.backgroundColor;
    setColor(colorToChange);
  };

  useEffect(() => {
    const colorsBtns = [];
    colors.forEach((color, index) => {
      colorsBtns.push(
        <div
          key={`colors${index}_${color}`}
          onClick={changeMainColorHandler}
          className="color"
          style={{ backgroundColor: color }}
        ></div>
      );
    });

    setColorsButtons(colorsBtns);
  }, []);

  useEffect(() => {
    let rows = [];
    const newGrid = [];

    for (let i = 0; i < gridLayout * gridLayout; i++) {
      rows.push(
        <div
          onClick={changeCellColorHandler}
          key={`cell${i + 1}_${Math.random()}`}
          className="cell"
        ></div>
      );
      if ((i + 1) % gridLayout === 0) {
        newGrid.push(rows);
        rows = [];
      }
    }

    setGrid(newGrid);
  }, [gridLayout]);

  return (
    <div className="App">
      <div className="content">
        <h1>Pixel Art</h1>
        <div className="controls">
          <button className="btn" onClick={setGridLayout.bind(null, 8)}>
            8x8
          </button>
          <button className="btn" onClick={setGridLayout.bind(null, 12)}>
            12x12
          </button>
          <button className="btn" onClick={setGridLayout.bind(null, 16)}>
            16x16
          </button>
          <button className="btn" onClick={setGridLayout.bind(null, 32)}>
            32x32
          </button>
        </div>
        <div className="controls">{colorsButtons}</div>
        <div ref={gridRef} className="pixelsgrid">
          {grid.map((row, index) => (
            <div key={`row${index + 1}`} className="row">
              {row}
            </div>
          ))}
        </div>
        <button onClick={downloadArtHandler} className="btn btn--download">
          Download you art
        </button>
      </div>
    </div>
  );
}

export default App;
