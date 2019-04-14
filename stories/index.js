import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import DataTable from '../src/dataTable'
import data from './data.json';

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
      sortable: false
    }
  ]

storiesOf('DataTable', module)
  .add('Demo', () => (
    <DataTable
        className={"table"}
        title={"Customers listing"}
        columns={columns}
        data={data}
        onSort={(fields) => {console.log(fields)}}
      >
      </DataTable>
  ))
  .add('with emoji', () => (
    <Button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));