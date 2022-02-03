import React from 'react'
import Img from './Components/image'
import TableResult from './Components/tableResult'
import rf from './service/rf'

import { Container, Button, Input, Grid, Menu, Segment, Form, Modal, Header, Icon } from 'semantic-ui-react'

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      file: null,
      data: null,
      activeItem: 'buscar',
      name: null,
      last_name: null,
      cpf: null,
      base64: null,
      modal: false,
      message: null,
      alert: false,
      isLoading: false
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  convertBase64 = () => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.state.file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  api = async () => {

    if (this.state.activeItem === 'buscar') {

      this.setState({ isLoading: true })

      if (this.state.file !== null) {
        this.setState({ base64: (await this.convertBase64(this.state.file)) })
      }

      rf.face(this.state.base64)
        .then((response) => {

          this.setState({
            data: response.data,
            isLoading: false
          })
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.setState({
              isLoading: false,
              alert: true,
              message: error.response.data.message
            })
          } else if (error.response.status != 200) {
            this.setState({
              isLoading: false,
              alert: true,
              message: error.response.data.message
            })
          } else {
          this.setState({
            isLoading: false,
            alert: true,
            message: 'Não foram encontrados codificações que superassem 70% de compatibilidade'
          })
        }
      })
    }

    if (this.state.activeItem === 'criar') {

      this.setState({ isLoading: true })

      if (this.state.file !== null) {
        this.setState({ base64: (await this.convertBase64(this.state.file))})
      }

      const payload = {
        name: this.state.name,
        last_name: this.state.last_name,
        cpf: this.state.cpf,
      }

      rf.createFace(payload)
        .then((response) => {
          if (response.status == 201) {
            const data_ = {
              'cpf': this.state.cpf,
              "image": this.state.base64
            }
            rf.createImage(data_)
            .then((response) => {
              this.setState({
                isLoading: false,
                alert:true,
                message: 'Pessoa cadastrada e condificação realizada com sucesso!'
              })
            })
            .catch((error) => {
              this.setState({
                isLoading: false,
                alert: true,
                message: error.response.data.message
              })
            })
          }

        })
        .catch((error) => {
          if (error.response.data.message === "cpf exist") {
            this.setState({
              isLoading: false,
              modal: true
            })
          } else {
            this.setState({
              isLoading: false,
              alert: true,
              message: error.response.data.message
            })
          }
        })
    }

  }

  addImage = async () => {

    this.setState({ isLoading: true })

    if (this.state.file !== null) {
      this.setState({ base64: (await this.convertBase64(this.state.file)) })
    }

    const addData = {
      cpf: this.state.cpf,
      image: this.state.base64
    }

    rf.createImage(addData)
      .then((response) => {
        this.setState({
          isLoading: false,
          message: response.data.message,
          modal: false,
          alert: true
        })
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          modal: false,
          alert: true,
          message: error.response.data.message
        })
      })
  }

  updateFileImg = (e) => {
    this.setState({
      file: e.target.files[0]
    })
  }

  reload = () => {
    this.setState({ 
      alert: false,
      file: null,
      data: null,
      name: null,
      cpf: null,
      base64: null,
      modal: false,
      message: null,
      isLoading: false })
  }

  render() {
    return (
      <>
        <Container>
          <Grid>
            <Grid.Column width={2}>
              <Menu fluid vertical tabular>
                <Menu.Item
                  name='buscar'
                  active={this.state.activeItem === 'buscar'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='criar'
                  active={this.state.activeItem === 'criar'}
                  onClick={this.handleItemClick}
                />
              </Menu>
            </Grid.Column>

            <Grid.Column stretched width={12}>
              <Segment>
                <>
                  {this.state.activeItem === 'buscar' &&
                    <>
                      <Input
                        type='file'
                        required
                        onChange={this.updateFileImg}>
                      </Input>

                      {this.state.file &&
                        <Img img={this.state.file} />
                      }

                      <Button
                        loading={this.state.isLoading}
                        primary
                        onClick={this.api}>
                        Buscar
                      </Button>,
                      {this.state.data &&
                        <TableResult props={this.state.data} />
                      }
                    </>
                  }

                  {this.state.activeItem === 'criar' &&
                    <>
                      <Form style={{ width: '400px', background: 'blue', padding: '10px' }} onSubmit={this.api}>
                        <Form.Group >
                          <Form.Input style={{ width: '400px', padding: '10px' }}
                            label='Nome'
                            placeholder='Nome'
                            name='name'
                            required
                            value={this.state.name}
                            onChange={this.handleChange}
                          />
                          </Form.Group>
                          <Form.Group >
                          <Form.Input style={{ width: '400px', padding: '10px' }}
                            label='Sobrenome'
                            placeholder='Sobrenome'
                            name='last_name'
                            required
                            value={this.state.last_name}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Input style={{ width: '400px', padding: '10px' }}
                            label="CPF"
                            placeholder='CPF'
                            name='cpf'
                            required
                            value={this.state.cpf}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Input style={{ width: '400px', padding: '10px' }}
                            type='file'
                            required
                            onChange={this.updateFileImg}>
                          </Form.Input>
                        </Form.Group>
                        <Form.Group>
                          <Form.Button
                            loading={this.state.isLoading}
                            primary
                            content='Submit'>
                            Criar Codificação
                          </Form.Button>
                        </Form.Group>
                      </Form>
                    </>
                  }
                </>
              </Segment>
            </Grid.Column>
          </Grid>
        </Container>

        <Modal
          open={this.state.modal}
        >
          <Modal.Header>Foto</Modal.Header>
          <Modal.Content image>
            <Img img={this.state.file} />
            <Modal.Description>
              <Header>ATENÇÃO</Header>
              <p>
                Já exite uma codiicação para este CPF
              </p>
              <p>Nome: {this.state.name}</p>
              <p>CPF: {this.state.cpf}</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => this.setState({ modal: false })}>
              Voltar
            </Button>
            <Button
              loading={this.state.isLoading}
              content="Deseja Atualizar?"
              labelPosition='right'
              icon='checkmark'
              onClick={() => this.addImage()}
              positive
            />
          </Modal.Actions>
        </Modal>

        <Modal
          basic
          open={this.state.alert}
          size='mini'
        >
          <Header icon>
            <Icon name='Alert' />
            Mensagem
          </Header>
          <Modal.Content>
            <p>
              {this.state.message}
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button 
              color='green' 
              inverted 
              onClick={() => this.reload()}>
              <Icon name='checkmark' /> Ok
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default App;