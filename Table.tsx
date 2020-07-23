import * as React from 'react';
import Style from './Table.scss';

interface SoloHeader
{
    label?: string;
    className?: string;
    width?:number;
    // minWidth?: number;
    // maxWidth?: number;
}
interface DataSets
{
    value?: string | number | React.ReactElement;
    className?: string;
}
interface SoloData
{
    dataSet?: Array<DataSets>
    child?: React.ReactElement;

}
interface Control {
  isControlled?: boolean;
  controlBlock?: React.ReactElement;
}
interface TableData {
    Headers?: Array<SoloHeader>;
    data?:Array<SoloData>;
    level?: 'level1' | 'level2' | 'level3';
    CanOpen?: boolean;
    Control?: Control;
}

const GetSizes = (HeaderData: Array<SoloHeader>, isContolled?: boolean):object => {
  //  '';
  let gridTemplateColumns = HeaderData?.map((SoloHeaderData) => {
    if (SoloHeaderData.width) {
      return `minmax(${SoloHeaderData.width}px,${SoloHeaderData.width}px)`;
    }
    return ('minmax(0%, 1fr)');
  });
  if (isContolled) {
    gridTemplateColumns.unshift('minmax(42px, 42px)');
  }
  return { gridTemplateColumns: gridTemplateColumns.join(' ') || '' };
};
const CreateTableHeader = (TableLevel: string, HeaderData?: Array<SoloHeader>) => HeaderData?.map(
  (SoloHeader, id) => ([(<th key={`Header${id}`} className={`${Style.Header} ${SoloHeader.className ? SoloHeader.className : ''} ${TableLevel}`}>{SoloHeader.label}</th>)]),
);

export const Table = ({
  Headers,
  data,
  level,
  CanOpen = true,
  Control,
} : TableData) => {
  const [ControlList, setControlList] = React.useState<Array<boolean>>([]);
  React.useEffect(() => {
    if (CanOpen && ControlList.length === 0) {
      setControlList(
                data?.map(() => false) || [],
      );
    }
  }, [ControlList.length, CanOpen, data]);
  let TableLevel = Style.Level1;
  switch (level) {
    case 'level1':
      TableLevel = Style.Level1;
      break;
    case 'level2':
      TableLevel = Style.Level2;
      break;
    case 'level3':
      TableLevel = Style.Level3;
      break;
    default:
      break;
  }
  return (
    <table className={`${Style.FullTable} ${TableLevel}`} style={GetSizes(Headers || [], Control?.isControlled)}>
      <thead className={Style.Headers}>
        <tr>
          {
            Control?.isControlled
              ? (
                <th
                  key="TableControl"
                  className={`${Style.Header} ${TableLevel}`}
                />
            ) : null
          }
          {CreateTableHeader(TableLevel, Headers)}
        </tr>
      </thead>
      <tbody>
        {
          data?.map((SoloDataset, id) => (
            <>
              <tr
                className={`${Style.soloRom} ${TableLevel} ${(SoloDataset.child && !Control?.isControlled) ? Style.Controlled : ''}`}
                key={`SoloRow${id}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    if (SoloDataset.child && !Control?.isControlled) {
                      let ControlListBuffer = [...ControlList];
                      ControlListBuffer[id] = !ControlListBuffer[id];
                      setControlList([...ControlListBuffer]);
                    }
                  }
                }}
                onClick={() => {
                  if (SoloDataset.child && !Control?.isControlled) {
                    let ControlListBuffer = [...ControlList];
                    ControlListBuffer[id] = !ControlListBuffer[id];
                    setControlList([...ControlListBuffer]);
                  }
                }}
              >
                {
                    Control?.isControlled
                      ? (
                        <td
                          key={`TableControl${id}`}
                          // tabIndex={0}
                          role="button"
                          tabIndex={0}
                          className={`${Style.SoloInfo} ${TableLevel} ${Style.Controller} ${ControlList[id] ? Style.Open : Style.Close}`}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              if (SoloDataset.child) {
                                let ControlListBuffer = [...ControlList];
                                ControlListBuffer[id] = !ControlListBuffer[id];
                                setControlList([...ControlListBuffer]);
                              }
                            }
                          }}
                          onClick={() => {
                            if (SoloDataset.child) {
                              let ControlListBuffer = [...ControlList];
                              ControlListBuffer[id] = !ControlListBuffer[id];
                              setControlList([...ControlListBuffer]);
                            }
                          }}
                        >
                          {Control.controlBlock || ''}
                        </td>
                  ) : null
                  }
                {
                  SoloDataset.dataSet?.map((SoloDataInfo, InfoId) => (
                    <td
                      key={`SoloInfo${id}-${InfoId}`}
                      className={`${Style.SoloInfo} ${SoloDataInfo.className ? SoloDataInfo.className : ''} ${TableLevel}`}
                    >
                      {SoloDataInfo.value}
                    </td>
                  ))
              }
              </tr>


              <tr key={`InfoBlockRow${id}`}>
                {
                (ControlList[id] && CanOpen)
                  ? <td key={`InfoBlock${id}`} colSpan={Headers?.length} style={{ gridColumn: `span ${Headers?.length}` }}>{SoloDataset.child}</td>
                  : null
              }
              </tr>
            </>
          ))
        }
      </tbody>
    </table>
  );
};
//
