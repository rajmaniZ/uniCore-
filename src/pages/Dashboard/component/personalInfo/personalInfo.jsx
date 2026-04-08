function PersonalInfo(){
  return (
    
    <>
    
      <header><h2>Personal information</h2>
      <select>
        <option value="7" > Last 7 Days      </option>
        
        <option value="30" > Last 30 Days      </option>
        
        <option value="180" > Last 6 Months      </option>
        
        <option value="365" > Last 1 year      </option>
        
      </select>
      </header>
      <main>
        <p>Phone-no. </p>
        <p>Email-id </p>
        <p>Branch </p>
        <p>year </p>
        <p>semester </p>
        <p>Address-  </p>
        <p> </p>
      </main>
    </>
  );
}

export default PersonalInfo;