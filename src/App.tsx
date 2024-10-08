import React, { useEffect, useState } from 'react';
import { IgrDataGrid, IgrDataGridModule } from 'igniteui-react-grids';
import { IgrCategoryChart, IgrCategoryChartModule } from 'igniteui-react-charts';
import { IgrPieChart, IgrPieChartModule } from 'igniteui-react-charts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

IgrDataGridModule.register();
IgrCategoryChartModule.register();
IgrPieChartModule.register();

function App() {
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("Click to add a comment");
  const [isEditing, setIsEditing] = useState(false); 
  const [showCommentBox, setShowCommentBox] = useState(false); 

  useEffect(() => {
    fetch('/data.json') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('1');
        }
        return response.json();
      })
      .then((data) => {
        console.log('2', data);
        setData(data);
      })
      .catch((error) => {
        console.error('3', error);
      });
  }, []);

  const chartData = data.map(item => ({
    total1: item.total1,
    total2: item.total2
  }));

  const pieChartData = [
    { label: 'Total 1', value: data.reduce((acc, item) => acc + item.total1, 0) },
    { label: 'Total 2', value: data.reduce((acc, item) => acc + item.total2, 0) },
  ];

  const exportToPDF = () => {
    const input = document.getElementById('pdf-content');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('download.pdf');
    });
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSaveComment = () => {
    setShowCommentBox(false); 
    setIsEditing(false); 
  };

  const handleToggleCommentBox = () => {
    setShowCommentBox(prev => !prev); 
  };

  return (
    <>
      <div>
        <button onClick={exportToPDF}>Export to PDF</button>
        <div id="pdf-content">
          {data.length > 0 ? (
            <>
              <button onClick={handleToggleCommentBox} style={{ marginBottom: '10px' }}>
                +
              </button>

              {showCommentBox && (
                <div>
                  <input
                    type="text"
                    value={comment}
                    onChange={handleCommentChange}
                    onBlur={handleSaveComment}
                    autoFocus
                    placeholder="Enter your comment"
                  />
                  <button onClick={handleSaveComment}>Save</button>
                </div>
              )}
              
              <IgrDataGrid
                autoGenerateColumns={true}
                dataSource={data}
                height="400px"
                width="100%"
              />
              <IgrCategoryChart
                dataSource={chartData}
                height="400px"
                width="100%"
                title="some title"
              >
                <IgrCategoryChart
                  valueMemberPath="total1"
                  categoryMemberPath="total2"
                  title="some title"
                />
              </IgrCategoryChart>

              <IgrPieChart
                dataSource={pieChartData}
                height="400px"
                width="100%"
                valueMemberPath="value"
                labelMemberPath="label"
                title="some title"
              />
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </>
  );

  //    <div>a
  //     { data.length > 0 ? 
  //    ( <IgrDataGrid
  //       autoGenerateColumns={true}
  //       dataSource={data}
  //       height="400px"
  //       width="100%"
  //     />) :
  //    ( <p>no data</p>)}
  //   </div>

  //   <div>
  //     b
  //     <IgrDataGrid
  //             autoGenerateColumns={true}
  //             dataSource={data}
  //             height="400px"
  //             width="100%"
  //           />
  //           <IgrCategoryChart
  //             dataSource={chartData}
  //             height="400px"
  //             width="100%"
  //             title="Actions Over Time"
  //           >
  //             <IgrCategoryChart
  //               valueMemberPath="total1"
  //               categoryMemberPath="total2"
  //               title="Actions Count"
  //             />
  //           </IgrCategoryChart>
  //   </div>

}

export default App;
