import {useState, useEffect} from "react";
//
import db from "./firebase/db";
//
import "./App.scss";
import TableItem from "./components/TableItem";
import Statistics from "./components/Statistics";
import {
  Link
} from "react-router-dom";


function App() {
  const [userList, setUserList] = useState([]);
  const [filteredValues, setFilteredValues] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("qualification-exam")
      .onSnapshot((snapshot) => {
        const data = [];

        snapshot.docs.forEach((person) => {
          const docItem = person.data();
          docItem["docId"] = person.id;

          data.push(docItem);
        });
        setUserList(data);
      });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    db.collection('qualification-exam').get()
    .then((querySnapshot) => {
        const uniqueValues = [];
        querySnapshot.forEach((doc) => {
            const collection = doc.data();
            if(!uniqueValues.includes(collection.role)) {
              uniqueValues.push(collection.role);
            }
        });
        setFilteredValues(uniqueValues);
    });
}, [])

function handleDelete(e){
  db.collection('qualification-exam').doc(e.target.dataset.id).delete();
}

  function handleFilter(e) {
    const value = e.target.value;
    const ref = db.collection('qualification-exam');
    if(value !== '') {
        ref.where('role', '==', value)
            .get()
            .then(processData );
    } else {
        ref.get()
            .then(processData );
    }
}
  function handleCheck(checked){
    let ref = db.collection("qualification-exam");
    if(checked){
      ref.where("isActive", "==", true)
       .get()
      .then(processData );
      }else {
        ref.get()
        .then(processData );
      }
  }

const processData = querySnapshot => {
  const tableDataCache = [] 
  querySnapshot.forEach((doc) => {
      const row = {
        ...doc.data(),
        docId: doc.id 
      };
    tableDataCache.push(row)
  });
  setUserList(tableDataCache)
};

  return (<>
    <header className="container mt-3 mb-3">
      <h1>Regisztráció admin</h1>
    </header>
    <section className="container">
      <Link to="/users/new">
        <button type="button" className="btn btn-primary">Új felhasználó</button>
    </Link>

    <div className="mb-3">
        <label htmlFor="filterSelector" className="form-label">Szűrés jogkörre</label>
        <select id="filterSelector" className={"form-select"} onChange={handleFilter} >
            <option value={""}>Válassz!</option>
            {filteredValues.map(value => (
            <option key={value} value={value}>{value}</option>
            ))}
        </select>
    </div>

    <div className="form-check" key="filter">
    <input type="checkbox"
      value="filter"
      id="filter"
      className="form-check-input"
      onChange={e => handleCheck(e.target.checked)} />
    <label htmlFor="filter">Aktív felhasználók</label>
    </div>


      <table className="table table-striped">
        <thead>
        <tr  className="headTitles">
          <th>Név</th>
          <th>Jogkör</th>
          <th>Email</th>
          <th>Műveletek</th>
           
        </tr>
        </thead>
        <tbody>
        {userList.map((user) => (
          <TableItem
            key={user.docId}
            fullName={user.fullName}
            email={user.email}
            role={user.role}
            id = {user.docId}
            handleDelete = {handleDelete}
          />
        ))}
        </tbody>
      </table>
      <Statistics filteredValues={filteredValues} userList={userList}/>
    </section>
  </>
  );
}

export default App;
