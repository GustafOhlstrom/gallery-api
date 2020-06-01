# Gallery API Endpoints

## Endpoints

| Endpoint    | Model     |
|-------------|-----------|
| /album      | Album     |
| /photos     | Photos    |
| /login      | User      |
| /register   | User      |

## `/albums`

| Data        | Type      | Requirement |
|-------------|-----------|-------------|
| `title`     | string    | required    |
| `photo_id`  | array     | optional    |

### `GET /albums`

Get all albums.

### `GET /albums/:albumId`

Get a album by ID.

### `POST /albums`

Create a new album.

### `PUT /albums/:albumId`

Update a album by ID.

### `DELETE /albums/:albumId`

Delete a album by ID.

## `/photos`

| Data        | Type      | Requirement |
|-------------|-----------|-------------|
| `title`     | string    | required    |
| `url`       | url       | required    |
| `comment`   | comment   | optional    |
| `album_id`  | array     | optional    |

### `GET /photos`

Get all photos.

### `GET /photos/:photoId`

Get a photo by ID.

### `POST /photos`

Create a new photo.

### `PUT /photos/:photoId`

Update a photo by ID.

### `DELETE /photos/:photoId`

Delete a photo by ID.

## `/login`

| Data        | Type      | Requirement |
|-------------|-----------|-------------|
| `email`     | email     | required    |
| `password`  | string    | required    |

### `POST /login`

Give access-token for user to use as auth.

## `/register`

| Data        | Type      | Requirement |
|-------------|-----------|-------------|
| `email`     | email     | required    |
| `password`  | string    | required    |
| `first_name`| string    | required    |
| `last_name` | string    | required    |

### `POST /register`

Register user
