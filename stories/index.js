import React from 'react';
import { storiesOf } from '@storybook/react';
import DataTable from '../src/dataTable'
import data from './data.json';
import Axios from 'axios'

const columns = [
    {
      name: "Id",
      key:"id",
      format: (value) => {return((<b>{"#" + value.id}</b>))},
      sortable: true
    },
    {
      name: "First Name",
      key:"first_name",
      searchable:true,
      sortable: true
    },
    {
      name: "Last Name",
      key:"last_name",
      searchable: true,
      sortable: true
    },
    {
      name: "Phone Number",
      key:"phone",
      searchable: true,
      sortable: false,
      format: (value) => {return(<a href={"tel:"+value.phone}>{value.phone}</a>)}
    },
    {
      name: "E-mail",
      key:"email",
      searchable: true,
      sortable: false,
      format: (value) => {return(<a href={"mailto:"+value.email}>{value.email}</a>)}
    },
    {
      name: "Gender",
      key:"gender",
      searchable: false,
      sortable: true,
      format: (value) => {return(<span>{value.gender === 'Male'?"Homme":"Femme"}</span>)}
    }
  ]
const getDataFromAjax = (setData, setRowCount, page, sort, search) => {
  let url
  if(page === 1){
    url = 'http://www.mocky.io/v2/5cb6340b33000013495d808c'
  }
  else{
    url = "http://www.mocky.io/v2/5cb65e0e3200004c00cd4487"
  }
  Axios.get(url).then((data) => {
    setRowCount(data.data.length);
    setData(data.data);
  })
}

storiesOf('DataTable', module)
  .add('Demo', () => (
    <DataTable
        className={"table"}
        title={"Customers listing"}
        columns={columns}
        data={data}
      >
      </DataTable>
  ))
  .add('with ajax', () => (
    <DataTable
      className={"table"}
      title={"Customers listing"}
      columns={columns}
      getData={getDataFromAjax}
      >
    </DataTable>
  ));