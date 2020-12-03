import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import moment from 'moment';
import Modal from "react-modal";
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';

import { uiCloseModal } from "../../actions/ui";
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from "../../actions/events";


// estilos personalizados para el evento 
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
// poner el Modal en la etiqueta raiz
Modal.setAppElement("#root");

// obtener una hora actual utilizando moment
const now = moment().minutes(0).seconds(0).add(1, 'hours'); // 3:00:00
const nowPlus1 = now.clone().add(1, 'hours');

const initEvent = {
  title: '',
  notes: '',
  start: now.toDate(),
  end: nowPlus1.toDate()
}

// Comienza la función del componente
export const CalendarModal = () => {

  // utilizo UseSelector para obtener los estado que hico el reducer y se los pasa al store
  const { modalOpen } = useSelector( state => state.ui );
  const { activeEvent } = useSelector( state => state.calendar );
  
  // iniciamos el useDispatch para poder hacer dispatch a las actions
  const dispatch = useDispatch();

  // Usestate para para el valor de la fecha inicio y fin y el titulo 
  const [dateStart, setDateStart] = useState( now.toDate() );
  const [dateEnd, setDateEnd] = useState(nowPlus1.toDate() );

  //UseSate para validar la variable del titulo
  const [ titleValid, setTitleValid ] = useState(true);

  // useSate para el valor de los atributos del formulario
  const [formValues, setFormValues] = useState({ initEvent });

  // destructuración de los atributos del formulario
  const { notes, title, start, end } = formValues;

  // Use efect que se ejecuta cuando inicia el componente o cuando activeEvent cambia de valor
  useEffect(() => {
    if(activeEvent){
      setFormValues(activeEvent);
    }else{
      setFormValues( initEvent );
    }

  }, [activeEvent, setFormValues]);

  // función para agregar el valor al formulario del campo que se este texteando
  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value      
    });
  }

  const closeModal = () => {
    //console.log("cerrar modal")
    dispatch( uiCloseModal() );
    dispatch( eventClearActiveEvent() );
    setFormValues(initEvent);
  };

  // función para poner la hora de inicio seleccionada en el formulario y en el useSate de seDateStart
  const handleStartDateChange = (e) => {
    setDateStart(e);
    setFormValues({
      ...formValues,
      start: e
    });
  }

  // función para poner la hora fin seleccionada en el formulario y en la variable setDateEnd
  const handleEndDateChange = (e) => {
    setDateEnd(e);
    setFormValues({
      ...formValues,
      end: e
    });
  }

  // función quese ejecuta cuando hacemos submit del formulario
  const handleSubmitForm = (e) => {
    e.preventDefault();

    const momentStart = moment(start);
    const momentEnd = moment(end);

    if( momentStart.isSameOrAfter( momentEnd )){
      Swal.fire('Error', 'La fecha fin debe ser mayor a la fecha de inicio', 'error');
      return;
    }

    if( title.trim().length < 2 ){
      return setTitleValid(false);
    }

    // Realizar grabación en la base de datos
    if( activeEvent ){
      dispatch( eventStartUpdate( formValues ) );
    }else{
      dispatch( eventStartAddNew(formValues) );
    }
    

    setTitleValid(true);
    closeModal();
    //console.log( formValues );
  }

  // retorno del componente
  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
    >
      <h1> { (activeEvent)? 'Editar evento' : 'Nuevo evento' }</h1>
      <hr />
      <form 
        className="container"
        onSubmit={ handleSubmitForm }
      >
        <div className="form-group">
            <label>Fecha y hora inicio</label>
            <DateTimePicker
                onChange={ handleStartDateChange  }
                value={ dateStart }
                className="form-control"
            />
        </div>

        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker
                onChange={ handleEndDateChange  }
                value={ dateEnd }
                minDate={ dateStart }
                className="form-control"
            />
        </div>

        <hr />
        <div className="form-group">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${ !titleValid && 'is-invalid' } `}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={ title }
            onChange={ handleInputChange }
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={ notes }
            onChange={ handleInputChange }
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
