import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import SortIcon from './components/sortIcon'
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap'

library.add(faSort, faSortUp, faSortDown)


class DataTable extends Component{

    constructor(props){
        super(props)
        this.state = {
            sortCriteria: {},
            currentPage: 1,
            perPage: 10,
            data: props.data
        }
    }

    onPaginate = (data, pageNumber, pageSize) => {
        --pageNumber;
        return data.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
    }
    handlePagination = (data, page) => {
        this.setState({...this.state, data: this.onPaginate(data, page, 10)});
    }

    handleSort = (key) => {
        let sortCriteria = {}
        if(this.state.sortCriteria.key === key)
            sortCriteria = {key: key, order: (this.state.sortCriteria.order + 1) % 3}
        else
            sortCriteria = {key: key, order: 1}
        this.setState({...this.state, sortCriteria: sortCriteria})
        if(this.props.onSort)
            this.props.onSort(sortCriteria)
    }

    handleSearch = (key, value) => {
        let searchCriteria = []
        searchCriteria = [...searchCriteria, {key: key, value: value}]
        searchCriteria = searchCriteria.filter((e) => {
            const sameKey = e.key === key && e.value !== value
            const differentKey = e.key !== key
            return !sameKey || differentKey
        });
        if(this.props.onSearch)
            this.props.onSearch(searchCriteria)
        else{
            let data = this.onSearch(this.props.data, searchCriteria)
            data = this.onPaginate(data, 1, 10)
            this.setState({...this.state, data: data})
        }

    }

    onSearch = (data, searchCriteria) => {
        return data.filter(
            (row) => {
                let res = searchCriteria.map(
                    (search) => {
                        return(row[search.key].includes(search.value))
                    }
                )
                return res.reduce((r,v) => r && v)
            }
        )
    }


    componentDidMount(){
        this.handlePagination(this.props.data, 1)
    }

    render(){
        const pagination = () => {
            const recordCount = this.props.rowNumber || this.props.data.length
            return(
                <Pagination>
                    <PaginationItem>
                        <PaginationLink first href="#" onClick={() => {this.handlePagination(this.props.data, 1)}}>First</PaginationLink>
                    </PaginationItem>
                    {[...Array(Math.ceil(recordCount/10))].map((_,i) => i + 1).map((page) => (<PaginationItem><PaginationLink onClick={() => {this.handlePagination(this.props.data, page)}} href="#">{page}</PaginationLink></PaginationItem>))}
                    <PaginationItem>
                        <PaginationLink last href="#" onClick={() => {this.handlePagination(this.props.data, Math.ceil(recordCount/10))}}>Last</PaginationLink>
                    </PaginationItem>
                </Pagination>
             )
        }

        const tableHead = this.props.columns.map(
            (column) => {
                if(column.sortable)
                    return(
                        <th >
                            <a
                                href="#"
                                onClick={() => {this.handleSort(column.key)}
                            }>
                                {column.name}
                            <SortIcon searchable={column.searchable} order={this.state.sortCriteria.key === column.key?this.state.sortCriteria.order:""}></SortIcon>
                            </a>
                        </th>
                    )
                else
                    return(<th >{column.name}</th>)
            }
        )

        const searchFields = this.props.columns.map(
            (column) => {
                if(column.searchable)
                    return(<td><input className='form-control' name={column.key} onChange={(e) => this.handleSearch(e.target.name, e.target.value)}></input></td>)
                else
                    return(<td></td>)

            }
        )

        const tableBody = this.state.data.map(
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
                {pagination()}
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