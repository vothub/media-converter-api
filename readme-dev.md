# MC dev notes

## Insert seed data

```
-- Drop existing tables first
DROP TABLE IF EXISTS vhmc.public.jobs;
DROP TABLE IF EXISTS vhmc.public.job_logs;
DROP TABLE IF EXISTS vhmc.public.job_runs;


-- Create jobs schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS vhmc.public.jobs (
    job_id uuid DEFAULT uuid_generate_v4 (),
    status VARCHAR DEFAULT 'new',
    input_url VARCHAR NOT NULL,
    origin VARCHAR NOT NULL,
    owner VARCHAR NOT NULL,
    requested_outputs VARCHAR NOT NULL,
    requested_opts VARCHAR,
    callback_url VARCHAR,
    time_created time DEFAULT now (),
    time_started time,
    time_finished time,
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
    time_started date,
    time_finished date,
    status VARCHAR DEFAULT 'new',
    PRIMARY KEY (job_run_id)
);

-- Insert sample job (263,343 MB)
INSERT INTO vhmc.public.jobs (
  input_url,
  origin,
  owner,
  requested_outputs
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
  requested_outputs
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
```
