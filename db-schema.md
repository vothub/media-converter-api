# DB Schema

```
-- Drop existing tables first
DROP TABLE IF EXISTS vhmc.public.jobs;
DROP TABLE IF EXISTS vhmc.public.job_logs;
DROP TABLE IF EXISTS vhmc.public.job_runs;
DROP TABLE IF EXISTS vhmc.public.queue;

-- Create jobs schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS vhmc.public.jobs (
    job_id uuid DEFAULT uuid_generate_v4 (),
    status VARCHAR DEFAULT 'new',
    input_url VARCHAR NOT NULL,
    origin VARCHAR NOT NULL,
    owner VARCHAR NOT NULL,
    preset VARCHAR NOT NULL,
    requested_opts VARCHAR,
    callback_url VARCHAR,
    time_created timestamp DEFAULT now (),
    time_started timestamp,
    time_finished timestamp,
    assigned_job_run uuid,
    PRIMARY KEY (job_id)
);

-- Create job_runs schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS vhmc.public.job_runs (
    job_run_id uuid DEFAULT uuid_generate_v4 (),
    job_id uuid NOT NULL,
    status VARCHAR,
    progress_percentage INT,
    worker_id VARCHAR,
    PRIMARY KEY (job_run_id)
);

-- Create job_logs schema
CREATE TABLE IF NOT EXISTS vhmc.public.job_logs (
    job_run_id uuid NOT NULL,
    job_id uuid NOT NULL,
    log_data VARCHAR,
    worker_id VARCHAR,
    time_started timestamp,
    time_finished timestamp,
    status VARCHAR DEFAULT 'new',
    PRIMARY KEY (job_run_id)
);

-- Create queue schema
CREATE TABLE IF NOT EXISTS vhmc.public.queue (
    queue_id uuid NOT NULL,
    job_id uuid NOT NULL,
    worker_id VARCHAR,
    worker_last_update timestamp,
    job_run_id uuid,
    time_created timestamp DEFAULT now (),
    status VARCHAR DEFAULT 'new',
    PRIMARY KEY (queue_id)
);
```

## Insert sample data

```
-- Insert sample job (263,343 MB)
INSERT INTO vhmc.public.jobs (
  input_url,
  origin,
  owner,
  preset
) VALUES (
    'https://download.blender.org/demo/movies/BBB/bbb_sunflower_1080p_30fps_normal.mp4',
    'test-suite',
    'vot-hq',
    'ogv'
);

-- Insert sample job (61,662 MB)
INSERT INTO vhmc.public.jobs (
  input_url,
  origin,
  owner,
  preset
) VALUES (
    'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
    'test-suite',
    'vot-lq',
    'ogv'
);
```

## Delete sample data

```
-- Drop individual job
DELETE FROM vhmc.public.jobs WHERE job_id='da9e5230-a65d-42e4-bc84-f4cb61268971'::uuid;

-- DELETE all jobs with origin = test-suite
DELETE FROM vhmc.public.jobs WHERE origin='test-suite';
```
