import { useEffect, useState } from "react";

const Statistics = ({userList, filteredValues}) => {
    const [stat, setStat] = useState()
    const [sum, setSum] = useState()
   
    useEffect(() => {
        let roleCount = {} 
        let sumOfRoleCounts = 0;
        for (let person in userList){
            if(roleCount[userList[person].role] === undefined){
                roleCount[userList[person].role] = 1
                sumOfRoleCounts++
            }else{
                roleCount[userList[person].role] ++;
                sumOfRoleCounts++
            }
        }

       setStat(roleCount)
       setSum(sumOfRoleCounts)
    }, [filteredValues, userList])

    return ( 
        <table className="table table-bordered table-striped">
        <thead>
            <tr className="statHeadTitles">
                <th scope="col">Jogkör</th>
                <th scope="col">Darab</th>
            </tr>
            
        </thead>
        <tbody>
        
        {filteredValues.map((value) => (
           <tr key={value}>
               <td>{value}</td>
               <td>{stat[value]}</td>
            </tr>
            
         ))}
          <tr>
              <th scope="row">Összesen</th>
              <td>{sum}</td>
          </tr>
        
        </tbody>
      </table>
     );
}
 
export default Statistics;