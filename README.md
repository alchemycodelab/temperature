# Temperature Network

The temperature network is a network of temperature monitors.
Each monitor has a name and will periodically take the temperature.

You can subscribe to get temperature changes. If subscribed you
will get periodic temperatures from our network.

## Subscription

Subscribe your back-end by hitting the
`http://temp.alchemycodelab.io/subscribe` route.

* `POST /subscribe` with

```json
{
  "url": "http://my-temp-be.com"
}
```

```json
{
  "_id": "7678709875444",
  "url": "http://my-temp-be.com"
}
```

## Status

Every 30 seconds your server will be hit at `YOUR_URL/status`
(e.g. `http://my-temp-be.com/status`). You are expected to return
a status code of `204`. If any other status code is returned
your app will be deregistered

## Register

Anytime a new temperature monitor comes online (or after you first
subscribe) the monitor will send a request to your server at
`YOUR_URL/register`. You are expected to return a status code of
`200` and a unique identifier (id).

`POST /register` with

```json
{
  "name": "Mars"
}
```

```json
{
  "id": "12434432423"
}
```

## Deregister

Anytime a new temperature monitor goes offline the monitor
wil send a request to your server at `YOUR_URL/deregister`.
Your are expected to return a status code of `204`

`DELETE /deregister` with

```json
{
  "id": "12434432423"
}
```

## Receive Temperatures

Whenever a new temperature is recorded the temperature monitor
will send a request to your server at `YOUR_URL/temp/MONITOR_ID`.

`POST /temp/12434432423` with

```json
{
  "temperature": 32.56
}
```
