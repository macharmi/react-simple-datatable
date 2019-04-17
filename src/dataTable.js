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
        this.sortCriteria = {}
        this.searchCriteria = []
        this.currentPage = 1
        this.state = {
            data: props.data || []
        }
    }

    onPaginate = (data, pageNumber, pageSize) => {
        this.currentPage = pageNumber
        --pageNumber;
        return data.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
    }
    handlePaginate = (data, page) => {
        this.currentPage = page
        this.setState({...this.state, data: this.onPaginate(data, page, 10)});
    }

    handleSort = (key) => {
        let sortCriteria = {}
        if(this.sortCriteria.key === key)
            this.sortCriteria = {key: key, order: (this.sortCriteria.order + 1) % 3}
        else
            this.sortCriteria = {key: key, order: 1}

        if(this.props.onSort){
            this.props.onSort(sortCriteria)
        }
        else{
            if(this.props.data){
                let data = {}
                if(this.searchCriteria && this.searchCriteria.length > 0)
                    data = this.onSearch(this.props.data, this.searchCriteria)
                else
                    data = this.props.data
                if(this.sortCriteria)
                    data = this.onSort(data, this.sortCriteria)
                data = this.onPaginate(data, 1, 10)
                this.setState({...this.state, data: data})
            }else{
                this.props.getData(this.setData, this.setRowCount, 1, this.sortCriteria, this.searchCriteria)
            }
        }
    }

    handleSearch = (key, value) => {
        let searchCriteria = []
        searchCriteria = [...this.searchCriteria, {key: key, value: value}]
        searchCriteria = searchCriteria.filter((e) => {
            const sameKey = e.key === key && e.value !== value
            const differentKey = e.key !== key
            return !sameKey || differentKey
        });
        this.searchCriteria = searchCriteria

        if(this.props.onSearch)
            this.props.onSearch(searchCriteria)
        else{
            if(this.props.data){
                let data = this.onSearch(this.props.data, searchCriteria)
                data = this.onSort(data, this.sortCriteria)
                data = this.onPaginate(data, 1, 10)
                this.setState({...this.state, data: data})
            }
            else{
                this.props.getData(this.setData, this.setRowCount, 1, this.sortCriteria, this.searchCriteria)
            }

        }
    }

    onSearch = (data, searchCriteria) => {
        const res = data.filter(
            (row) => {
                let res = searchCriteria.map(
                    (search) => {
                        return(row[search.key].includes(search.value))
                    }
                )
                return res.reduce((r,v) => r && v)
            }
        )
        this.rowCount = res.length
        return res
    }

    onSort = (data, sortCriteria) => {
        return data.sort(
            (row1, row2) => {
                if(row1[sortCriteria.key] < row2[sortCriteria.key]) { return -1 * (sortCriteria.order - 1.5); }
                if(row1[sortCriteria.key] > row2[sortCriteria.key]) { return (sortCriteria.order - 1.5); }
                return 0;
            }
        )
    }
    setData = (data) => {this.setState({...this.state, data: data})}
    setRowCount = (rowCount) => {this.rowCount = rowCount}
    getRecordCount = () => {
        return this.rowCount || this.props.rowCount || (this.props.data && this.props.data.length) || 0
    }

    componentDidMount(){

        if(this.props.data){
            this.handlePaginate(this.props.data, 1)
        }
        else{
            this.props.getData(this.setData, this.setRowCount, 1, this.sortCriteria, this.searchCriteria)
        }
    }

    render(){
        const pagination = () => {
            const recordCount = this.rowCount || this.props.rowCount || (this.props.data && this.props.data.length) || 0
            let handleClick
            if(this.props.data)
                handleClick = (page) => {this.handlePaginate(this.props.data, page)}
            else
                handleClick = (page) => {
                    this.props.getData(this.setData, this.setRowCount, page, this.sortCriteria, this.searchCriteria)
                    this.currentPage = page
                }

            return(
                <Pagination>
                    <PaginationItem>
                        <PaginationLink
                            first
                            href={''}
                            onClick={() => {handleClick(1)}}
                        >
                        </PaginationLink>
                    </PaginationItem>
                    {[...Array(Math.ceil(recordCount/10))].map((_,i) => i + 1).map(
                        (page) => (
                        <PaginationItem
                            active={page === this.currentPage}
                        >
                            <PaginationLink
                                onClick={() => {handleClick(page)}}
                                href={''}>{page}
                            </PaginationLink>
                        </PaginationItem>))}
                    <PaginationItem>
                        <PaginationLink
                            last
                            href={''}
                            onClick={() => {handleClick(Math.ceil(recordCount/10))}}>
                            Last
                        </PaginationLink>
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
                            <SortIcon searchable={column.searchable} order={this.sortCriteria.key === column.key?this.sortCriteria.order:""}></SortIcon>
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
                            return(<td >{column.format(dataLine)}</td>)
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