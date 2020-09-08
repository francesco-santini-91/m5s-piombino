var aws = require('aws-sdk');
aws.config.region = 'us-east-2';

exports.upload = function(request, response, next) {
    const s3 = new aws.S3();
    const fileName = request.query['file-name'];
    const fileType = request.query['file-type'];
    const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Expires: 120,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (errors, data) => {
        if(errors) {
            return next(errors);
        }
        const returnData = {
            signedRequest: data,
            url: 'https://'+process.env.S3_BUCKET+'.s3.amazonaws.com/'+fileName
        };
        response.json({returnData});
    });
}