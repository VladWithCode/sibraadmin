import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "moment/locale/es-mx";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { messages } from '../../helpers/calendarSetup';
import { CalendarEvent } from './CalendarEvent';

moment.locale('es-mx');

const localizer = momentLocalizer(moment) // or globalizeLocalizer

const events = [
    {
        title: 'cumpleaños del jefe',
        start: moment().toDate(),
        end: moment().add(4, 'hours').toDate(),
        bgcolor: '#fafafa',
        state: 'late'
    },
    {
        title: 'cumpleaños del jefe',
        start: moment().toDate(),
        end: moment().add(4, 'hours').toDate(),
        bgcolor: '#fafafa',
        state: 'today'
    },
    {
        title: 'cumpleaños del jefe',
        start: moment().toDate(),
        end: moment().add(4, 'hours').toDate(),
        bgcolor: '#fafafa',
        state: 'soon'
    },

]

export const CalendarComponent = () => {

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    const eventStyleGetter = (event, start, end, isSelected, state) => {
        // console.log(event, start, end, isSelected);

        const style = {
            backgroundColor: event.state === 'late' ? 'red' : event.state === 'today' ? 'green' : 'orange',
            color: 'white'
        }

        return { style }
    }

    const onDoubleClick = e => {
        console.log(e);
    }

    const onSelectEvent = e => {
        console.log(e);
    }

    const onViewChanged = e => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    return (

        <div className="app-screen projects-screen">

            <div className="app-screen__title projects-screen-top">
                <h1 className="app-screen__title" >Historiales</h1>
            </div>

            <div className="history">
                <div className="card calendar">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        messages={messages}
                        eventPropGetter={eventStyleGetter}
                        onDoubleClickEvent={onDoubleClick}
                        onSelectEvent={onSelectEvent}
                        onView={onViewChanged}
                        view={lastView}
                        components={{
                            event: CalendarEvent
                        }}
                    />
                </div>

            </div>
        </div>

    )
}
