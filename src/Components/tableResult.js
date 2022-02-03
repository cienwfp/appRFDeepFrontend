import React from 'react'
import { Header, Image, Table } from 'semantic-ui-react'

const TableResult = (props) => (

    console.log('props', props),

    <>
        <Table >
            <Table.Header >
                <Table.Row >
                    <Table.HeaderCell>Imagem</Table.HeaderCell>
                    {/* <Table.HeaderCell>Nome</Table.HeaderCell> */}
                    <Table.HeaderCell>CPF</Table.HeaderCell>
                    <Table.HeaderCell>Distância</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            {Object.keys(props.props).map(key =>
                <Table.Row key={props.props[key].cpf}>
                    <Table.Cell>
                        <Image src={props.props[key].image} rounded size='small' />
                    </Table.Cell>
                    {/*<Table.Cell> {props.props[key].name}</Table.Cell>*/}
                    <Table.Cell> {props.props[key].cpf}</Table.Cell>
                    <Table.Cell>{String(((1 - props.props[key].distance) * 100).toFixed(2))} %w</Table.Cell>
                </Table.Row>
            )}
        </Table>
    </>
)

export default TableResult