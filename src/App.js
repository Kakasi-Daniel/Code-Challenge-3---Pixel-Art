import './App.css';
import { useRef, useState, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';

const colors = ['red','purple','greenyellow','blue','yellow','orange','white','black','beige','salmon','brown'];

function App() {
  const [gridLayout, setGridLayout] = useState(8);
  const [grid, setGrid] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [gridInput, setGridInput] = useState('');
  const [colorInputError, setColorInputError] = useState(null);
  const [gridInputError, setGridInputError] = useState(null);
  const [colorsButtons, setColorsButtons] = useState([]);
  const [color,_setColor] = useState('red')
  const colorRef = useRef(color);
  const gridRef = useRef();

  const setColor = (col) =>{
    colorRef.current = col;
    _setColor(col)
  }

  const colorInputChangeHandler = (e) => {
    var s = new Option().style;
    s.color = e.target.value;
    if(s.color === e.target.value || /^#[0-9A-F]{6}$/i.test(e.target.value)){
      setColorInputError(null)
    }else{
      setColorInputError('errorBorder')
    }
    setColorInput(e.target.value)
  };

  const gridInputChangeHandler = (e) => {
    if(+e.target.value < 3){
      setGridInputError('errorBorder')
    }else{
      setGridInputError(null)
    }
    setGridInput(Math.floor(+e.target.value))
  };

  const customColorHandler = (e) => {
    e.preventDefault()
    if(!colorInputError && colorInput !== ""){
      setColor(colorInput)
    }
  };

  const customGridHandler = (e) => {
    e.preventDefault()
    if(!gridInputError && gridInput !== ""){
      setGridLayout(gridInput)
    }
  };

  const downloadArtHandler = () => {
    html2canvas(gridRef.current).then((canvas) => {
      let link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'yourPixArt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const changeCellColorHandler = (e) => {
    if (e.target.style.background === colorRef.current) {
      e.target.style.background = 'rgb(255,255,255)';
    } else {
      e.target.style.background = colorRef.current;
    }
  };

  const changeMainColorHandler = useCallback((e) => {
    let colorToChange = '';
    colorToChange = e.target.style.backgroundColor;
    setColor(colorToChange);
  }, []);

  useEffect(() => {
    const colorsBtns = [];
    colors.forEach((color, index) => {
      colorsBtns.push(<div  key={`colors${index}_${color}`} onClick={changeMainColorHandler} className="color"  style={{ backgroundColor: color }}  ></div>);
    });

    setColorsButtons(colorsBtns);
  }, [changeMainColorHandler]);

  useEffect(() => {
    let rows = [];
    const newGrid = [];

    for (let i = 0; i < gridLayout * gridLayout; i++) {
      rows.push(<div  onClick={changeCellColorHandler}  key={`cell${i + 1}_${Math.random()}`} className="cell" ></div>);
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
          <button className="btn" onClick={setGridLayout.bind(null, 8)}>8x8</button>
          <button className="btn" onClick={setGridLayout.bind(null, 12)}>12x12</button>
          <button className="btn" onClick={setGridLayout.bind(null, 16)}>16x16</button>
          <button className="btn" onClick={setGridLayout.bind(null, 32)}>32x32</button>
        </div>
        <div className="controls">{colorsButtons}</div>
        <div className="controls">
          <form onSubmit={customColorHandler} className="custom custom--color">
            <label htmlFor="color">Custom color:
              <input className={colorInputError} value={colorInput} onChange={colorInputChangeHandler} type="text"  id="color"  placeholder="magenta or #FF00FF"  />
            </label>
            <button type="submit" className="btn btn--set">Set</button>
            </form>
          <div className="currentColor" style={{backgroundColor:color}}></div>
          <form onSubmit={customGridHandler} className="custom custom--grid">
            <label htmlFor="grid">Custom grid:
              <input  className={gridInputError}  value={gridInput} onChange={gridInputChangeHandler}  placeholder="3 to infinity" type="number"  min="3" id="grid"  />
            </label>
            <button type="submit" className="btn btn--set">Set</button>
            </form>
        </div>
        <div ref={gridRef} className="pixelsgrid">
          {grid.map((row, index) => (<div key={`row${index + 1}`} className="row">{row}</div>))}
        </div>
        <button onClick={downloadArtHandler} className="btn btn--download">Download your art</button>
      </div>
    </div>
  );
}

export default App;
