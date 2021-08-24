import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "moment/locale/es-mx";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { messages } from '../../helpers/calendarSetup';
import { CalendarEvent } from './CalendarEvent';
import { useSelector } from 'react-redux';

moment.locale('es-mx');

const localizer = momentLocalizer(moment) // or globalizeLocalizer

export const CalendarComponent = () => {

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    const { records } = useSelector(state => state);

    const [events, setEvents] = useState(
        records.map((record) => ({
            lotId: record.lot,
            projectId: record.projectId,
            title: record.customer.fullName,
            start: moment().toDate(),
            end: moment().toDate(),
            bgcolor: '#fafafa',
            isLate: record.paymentInfo.isLate,
            hasProrogation: record.paymentInfo.isLate,
            allDay: true,
            phoneNumber: record.customer.phoneNumber
        }))
    )
    useEffect(() => {

        setEvents(
            records.map((record) => ({
                lotId: record.lot,
                projectId: record.project,
                title: record.customer.fullName,
                start: moment().toDate(),
                end: moment().toDate(),
                bgcolor: '#fafafa',
                isLate: record.paymentInfo.isLate,
                hasProrogation: record.paymentInfo.isLate,
                allDay: true,
                phoneNumber: record.customer.phoneNumber,
                event: 'Pago del lote'
            }))
        )

    }, [records])

    console.log(records);

    const eventStyleGetter = ({ event, isLate, hasProrogation, isSelected }) => {
        // console.log(event, start, end, isSelected);


        const style = {
            backgroundColor: isLate ? 'tomato' : hasProrogation ? '#FF9800' : 'white',
            color: 'black'
        }

        return { style }
    }

    const onDoubleClick = e => {
        console.log(e);
    }

    const onSelectEvent = ({ lotId, projectId }) => {
        console.log('holi');
    }

    const onViewChanged = e => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    // console.log(moment("2021-08-02T19:14:28.846Z").toDate());

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
