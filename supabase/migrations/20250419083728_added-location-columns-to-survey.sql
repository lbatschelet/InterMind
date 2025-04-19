ALTER TABLE surveys
ADD COLUMN location_lat DOUBLE PRECISION DEFAULT NULL,
ADD COLUMN location_lng DOUBLE PRECISION DEFAULT NULL;

CREATE INDEX idx_surveys_location ON surveys(location_lat, location_lng);