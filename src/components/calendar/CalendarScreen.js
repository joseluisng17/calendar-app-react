import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { Navbar } from '../ui/Navbar';
import { messages } from '../../helpers/calendar-messages-es';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { uiOpenModal } from '../../actions/ui';
import { eventSetAtive, eventClearActiveEvent, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import { DeleteEventFab } from '../ui/DeleteEventFab';
import { useEffect } from 'react';


// moment para cambiar ha español
moment.locale('es');

// propio de la libreria de calendarios una constante donde le pasamos la libreria de moment
const localizer = momentLocalizer(moment);


export const CalendarScreen = () => {

    // iniciamos el useDispatch para poder hacer dispatch a las actions
    const dispatch = useDispatch();

    // uso de useSelector para traer los events del state del reducer de calendarReducer
    const { events, activeEvent } = useSelector( state => state.calendar );
    const { uid } = useSelector( state => state.auth );

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    useEffect(() => {
        dispatch( eventStartLoading() );
    }, [dispatch])

    // función para al dar doble click en el evento se abra el modal
    const onDoubleClick = (e) => {
        // console.log("doble click");
        // hacemos un dispatch al action ui para indicarle la función de abrir modal
        dispatch(uiOpenModal());
    }

    const onSelectEvent = (e) => {
        //console.log("un click");
        dispatch(eventSetAtive(e));
    }

    const onViewchange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        dispatch( eventClearActiveEvent() );
    }

    // estilos para nuestro calendarios
    const eventStyleGetter = (event, start, end, isSelected ) => {
        console.log(event, start, end, isSelected );

        const style = {
            backgroundColor: (uid === event.user._id ) ? '#367CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }

        return {
            style
        }
    };

    return (
        <div className="calendar-screen">
            <Navbar />

            <Calendar
                localizer={localizer}
                events={ events }
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter = {eventStyleGetter}
                onDoubleClickEvent={ onDoubleClick }
                onSelectEvent={ onSelectEvent }
                onView={ onViewchange }
                onSelectSlot={ onSelectSlot }
                selectable={ true }
                view={ lastView }
                components={{
                    event: CalendarEvent
                }}
            />

                <AddNewFab />

                { (activeEvent) && <DeleteEventFab />}
                

            <CalendarModal />

        </div>        
    )
}
