# Deploy to S3 workflow

A workflow that auto-deploys our web application to Amazon S3 on every push to master.

## Set up

1. Create an S3 bucket with getObject access for everyone. You can use this bucket policy:

```
{
    "Version": "2008-10-17",
    "Id": "Policy1397632521960",
    "Statement": [
        {
            "Sid": "Stmt1397633323327",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<bucket_name>/*"
        }
    ]
}

```

2. Configure your bucket for [S3 static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/static-website-hosting.html).

3. Create an IAM permission policy that allows full access to the bucket we just created so we can sync our website to S3. (AWS -> IAM -> Policies -> Create new policy -> JSON -> Copy-paste the below and replace `<bucket_name>`). You can use this permission policy:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::<bucket_name>",
                "arn:aws:s3:::<bucket_name>/*"
            ]
        }
    ]
}
```

4. Create an IAM user that we will use to sync our website to S3. (AWS -> IAM -> Users -> New user)

- Access type: programatic access
- Attach the permission policy we just created
- ⚠️ Copy-paste the Access key ID and Secret access key (shown in the last step of create user in AWS)

5. Add the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` secrets to your GitHub repository.

6. Update the following variables in the workflow file:
- AWS_REGION
- AWS_S3_BUCKET
- environment_url (in `update deployment status to success` curl command)
