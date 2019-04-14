import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import SortIcon from './components/sortIcon'

library.add(faSort, faSortUp, faSortDown)


class DataTable extends Component{

    constructor(props){
        super(props)
        this.state = {
            sortCriteria: {},
            currentPage: 1,
            perPage: 10
        }
    }

    render(){
        let searchCriteria = []
        let sortCriteria = {}
        const raiseSearchEvent = (key, value) => {
            searchCriteria = [...searchCriteria, {key: key, value: value}]
            searchCriteria = searchCriteria.filter((e) => {
                const sameKey = e.key === key && e.value !== value
                const differentKey = e.key !== key
                return !sameKey || differentKey
            });
            if(this.props.onSearch)
                this.props.onSearch(searchCriteria)
        }

        const raiseSortEvent = (key) => {
            if(this.state.sortCriteria.key === key)
                sortCriteria = {key: key, order: (this.state.sortCriteria.order + 1) % 3}
            else
                sortCriteria = {key: key, order: 1}
            this.setState({...this.state, sortCriteria: sortCriteria})
            if(this.props.onSort)
                this.props.onSort(sortCriteria)
        }

        const tableHead = this.props.columns.map(
            (column) => {
                if(column.sortable)
                    return(
                        <th >
                            <a  name="" 
                                onClick={() => {raiseSortEvent(column.key)}
                            }>
                                {column.name}
                            </a>
                            <SortIcon searchable={column.searchable} order={this.state.sortCriteria.key === column.key?this.state.sortCriteria.order:""}></SortIcon>
                            {" "}{}
                        </th>
                    )
                else
                    return(<th >{column.name}</th>)
            }
        )

        const searchFields = this.props.columns.map(
            (column) => {
                if(column.searchable)
                    return(<td><input className='form-control' name={column.key} onChange={(e) => raiseSearchEvent(e.target.name, e.target.value)}></input></td>)
                else
                    return(<td></td>)

            }
        )

        const tableBody = this.props.data.map(
            (dataLine) => {
                const rowData = this.props.columns.map(
                    (column) => {
                        if(column.format)
                            return(<td >{column.format(dataLine[column.key])}</td>)
                        else
                            return(<td >{dataLine[column.key]}</td>)
                    }
                )
                return(<tr>{rowData}</tr>)
            }
        )

        return(
            <div>
                <h1>{this.props.title}</h1>
                <table className={this.props.className}>
                    <thead>
                        <tr>
                            {tableHead}
                        </tr>
                        <tr>
                            {searchFields}
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </table>
            </div>
        )
    }

}

export default DataTable;