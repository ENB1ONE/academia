import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    client.connect('204.216.180.87', username='ubuntu', timeout=8)
    print('SSH connection to OCI successful!')
    stdin, stdout, stderr = client.exec_command('pm2 status formsync-api')
    print('PM2 Status:\n', stdout.read().decode())
    
    # check cloudflared tunnel
    stdin, stdout, stderr = client.exec_command('ps aux | grep cloudflared')
    print('Cloudflared:\n', stdout.read().decode())
    client.close()
except Exception as e:
    print('SSH error:', e)
