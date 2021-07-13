const TableItem = ({ fullName, role, email, id,handleDelete }) => {
  return (
    <tr>
      <td>{fullName}</td>
      <td>{role}</td>
      <td>{email}</td>
      <td>
      <button 
        type="button" 
        data-id={id}
        className="btn btn-danger" 
        onClick={handleDelete}>
        Törlés
        </button>
      </td>
         
    </tr>
  );
};

export default TableItem;
