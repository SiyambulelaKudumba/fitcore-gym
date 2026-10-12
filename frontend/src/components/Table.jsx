import { Table as BSTable } from "react-bootstrap";

export default function Table({ columns, data, keyField = "id", actions }) {
  return (
    <BSTable striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          {actions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
              No records found.
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && <td>{actions(row)}</td>}
            </tr>
          ))
        )}
      </tbody>
    </BSTable>
  );
}