import React from 'react'

export const CalendarEvent = ({ event }) => {
    //console.log(event);

    const { title, user } = event;

    return (
        <div>
            <span>{ title }</span>
            <strong>- { user.name }</strong>
        </div>
    )
}
