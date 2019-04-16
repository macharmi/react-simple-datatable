import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import DataTable from '../src/dataTable'
import data from './data.json';
import Axios from 'axios'

const columns = [
    {
      name: "Id",
      key:"id",
      format: (value) => {return((<b>{"#" + value}</b>))},
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
      format: (value) => {return(<a href={"tel:"+value}>{value}</a>)}
    },
    {
      name: "E-mail",
      key:"email",
      searchable: true,
      sortable: false,
      format: (value) => {return(<a href={"mailto:"+value}>{value}</a>)}
    },
    {
      name: "Gender",
      key:"gender",
      searchable: false,
      sortable: true,
      format: (value) => {return(<span>{value === 'Male'?"Homme":"Femme"}</span>)}
    }
  ]
const getDataFromAjax = (setData, setRowCount, page, sort, search) => {
  let url
  if(page === 1){
    url = 'http://www.mocky.io/v2/5cb6340b33000013495d808c'
  }
  if(page === 2){
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
  .add('with emoji', () => (
    <DataTable
      className={"table"}
      title={"Customers listing"}
      columns={columns}
      getData={getDataFromAjax}
      >
    </DataTable>
  ));