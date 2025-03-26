import boto3
import os
import subprocess
import time
import logging
from dotenv import load_dotenv

# Set up logging for debugging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load AWS credentials from .env one directory up (module-11)
script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, '..', '.env')  # Looks in module-11
load_dotenv(env_path)

aws_access_key = os.getenv('AWS_ADMIN_IAM_ACCESS_KEY')
aws_secret_key = os.getenv('AWS_ADMIN_IAM_SECRET_ACCESS_KEY')
instance_id = os.getenv('AWS_EC2_INSTANCE_ID')
key_file_path = os.getenv('AWS_EC2_PEM_KEY_FILE')

# Validate all required environment variables
required_vars = {
    'AWS_ADMIN_IAM_ACCESS_KEY': aws_access_key,
    'AWS_ADMIN_IAM_SECRET_ACCESS_KEY': aws_secret_key,
    'AWS_EC2_INSTANCE_ID': instance_id,
    'AWS_EC2_PEM_KEY_FILE': key_file_path
}
missing_vars = [var for var, value in required_vars.items() if not value]
if missing_vars:
    logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
    exit(1)

# Resolve key_file_path relative to the .env file's directory (module-11)
env_dir = os.path.dirname(env_path)  # Directory containing .env (module-11)
key_file_path = os.path.abspath(os.path.join(env_dir, key_file_path))  # Convert to absolute path

# Validate key file accessibility
if not os.path.exists(key_file_path):
    logger.error(f"SSH key file not found at: {key_file_path}")
    exit(1)

# Initialize EC2 client
try:
    ec2 = boto3.client(
        'ec2',
        region_name='us-west-2',  # Update if your instance is in a different region
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key
    )
except Exception as e:
    logger.error(f"Failed to initialize EC2 client: {e}")
    exit(1)

# Configuration
#ssh_user = "ec2-user"  # Default user for Amazon Linux 2023 AMI
ssh_user = "deploy"  


# --- Helper Functions ---

def get_instance_state(ec2_client, instance_id):
    """Retrieve the current state of the EC2 instance."""
    try:
        response = ec2_client.describe_instances(InstanceIds=[instance_id])
        state = response['Reservations'][0]['Instances'][0]['State']['Name']
        logger.info(f"Instance state: {state}")
        return state
    except Exception as e:
        logger.error(f"Error retrieving instance state: {e}")
        return None

def get_public_ip(ec2_client, instance_id):
    """Get the public IP address of the instance if it's running."""
    try:
        response = ec2_client.describe_instances(InstanceIds=[instance_id])
        ip = response['Reservations'][0]['Instances'][0].get('PublicIpAddress', None)
        if ip:
            logger.info(f"Public IP retrieved: {ip}")
        else:
            logger.warning("No public IP available.")
        return ip
    except Exception as e:
        logger.error(f"Error retrieving public IP: {e}")
        return None

def start_instance(ec2_client, instance_id):
    """Start the instance and wait for it to be running."""
    logger.info(f"Starting instance {instance_id}...")
    try:
        ec2_client.start_instances(InstanceIds=[instance_id])
        waiter = ec2_client.get_waiter('instance_running')
        waiter.wait(
            InstanceIds=[instance_id],
            WaiterConfig={'Delay': 15, 'MaxAttempts': 40}  # 10-minute timeout
        )
        logger.info("Instance is now running.")
        return True
    except Exception as e:
        logger.error(f"Error starting instance: {e}")
        return False

def stop_instance(ec2_client, instance_id, force=False):
    """Stop the instance with optional force, handling timeouts."""
    action = "Force stopping" if force else "Stopping"
    logger.info(f"{action} instance {instance_id}...")
    try:
        ec2_client.stop_instances(InstanceIds=[instance_id], Force=force)
        waiter = ec2_client.get_waiter('instance_stopped')
        waiter.wait(
            InstanceIds=[instance_id],
            WaiterConfig={'Delay': 15, 'MaxAttempts': 20}  # 5-minute timeout
        )
        logger.info("Instance stopped successfully.")
        return True
    except Exception as e:
        logger.error(f"Error stopping instance: {e}")
        return False

def ssh_into_instance(ip, key_path):
    """Run an SSH session within the Python script, auto-accepting host key."""
    if not ip:
        logger.error("No public IP available for SSH.")
        return
    # Auto-accept host key and discard known_hosts entry (use NUL for Windows)
    command = f'ssh -i "{key_path}" -o StrictHostKeyChecking=no -o UserKnownHostsFile=NUL {ssh_user}@{ip}'
    logger.info(f"Connecting via SSH: {command}")
    try:
        subprocess.run(command, shell=True, check=True)
        logger.info("SSH session ended.")
    except subprocess.CalledProcessError as e:
        logger.error(f"SSH connection failed: {e}")

# --- Main Program ---

def main():
    # Initial state check
    state = get_instance_state(ec2, instance_id)
    if not state:
        logger.error("Failed to retrieve instance state. Exiting.")
        exit(1)
    print(f"Instance {instance_id} is currently in state: {state}")

    # Handle initial startup
    ip = None
    if state == 'stopped':
        start_choice = input("Instance is stopped. Would you like to start it? (y/n): ").lower()
        if start_choice == 'y':
            if start_instance(ec2, instance_id):
                ip = get_public_ip(ec2, instance_id)
                if ip:
                    print(f"Instance started successfully. Public IP: {ip}")
                else:
                    print("Failed to retrieve public IP after starting.")
                    exit(1)
            else:
                print("Failed to start instance. Exiting.")
                exit(1)
        else:
            print("Exiting without starting the instance.")
            exit(0)
    elif state == 'running':
        ip = get_public_ip(ec2, instance_id)
        if ip:
            print(f"Instance is already running. Public IP: {ip}")
        else:
            print("Instance is running but no public IP found. Exiting.")
            exit(1)
    else:
        print(f"Instance is in an unexpected state: {state}. Cannot proceed.")
        exit(1)

    # Interactive menu
    while True:
        print("\n--- EC2 Management Menu ---")
        print(f"Instance State: {get_instance_state(ec2, instance_id)} | Public IP: {ip}")
        print("1. SSH into instance")
        print("2. Stop instance and exit")
        print("3. Refresh instance status")
        print("4. Exit without stopping")
        choice = input("Select an option (1-4): ")

        if choice == '1':
            ssh_into_instance(ip, key_file_path)
        elif choice == '2':
            print("Preparing to stop the instance...")
            if stop_instance(ec2, instance_id):
                print("Instance stopped successfully. Exiting.")
                exit(0)
            else:
                print("Instance failed to stop within 5 minutes.")
                force_choice = input("Would you like to force stop the instance? (y/n): ").lower()
                if force_choice == 'y':
                    if stop_instance(ec2, instance_id, force=True):
                        print("Instance force stopped successfully. Exiting.")
                        exit(0)
                    else:
                        print("Error: Instance still did not stop even with force.")
                        retry = input("Difficulty shutting down. Try again? (y/n): ").lower()
                        if retry == 'y':
                            if stop_instance(ec2, instance_id, force=True):
                                print("Instance stopped on retry. Exiting.")
                                exit(0)
                            else:
                                print("Still unable to stop instance. Check AWS Console for issues.")
                                exit(1)
                        else:
                            print("Exiting without stopping. Instance may still be running.")
                            exit(1)
                else:
                    print("Exiting without forcing stop. Instance may still be running.")
                    exit(1)
        elif choice == '3':
            new_state = get_instance_state(ec2, instance_id)
            new_ip = get_public_ip(ec2, instance_id)
            if new_state:
                ip = new_ip if new_ip else ip
                print(f"Updated State: {new_state} | Public IP: {ip if ip else 'None'}")
            else:
                print("Failed to refresh status.")
        elif choice == '4':
            if get_instance_state(ec2, instance_id) == 'running':
                shutdown = input("Instance is running. Shut down before exiting? (y/n): ").lower()
                if shutdown == 'y':
                    if stop_instance(ec2, instance_id):
                        print("Instance stopped successfully. Exiting.")
                        exit(0)
                    else:
                        print("Failed to stop instance within timeout.")
                        force = input("Force stop the instance? (y/n): ").lower()
                        if force == 'y' and stop_instance(ec2, instance_id, force=True):
                            print("Instance force stopped. Exiting.")
                            exit(0)
                        else:
                            print("Could not stop instance. Exiting anyway.")
                            exit(1)
                else:
                    print("Exiting without stopping the instance.")
                    exit(0)
            else:
                print("Instance is not running. Exiting.")
                exit(0)
        else:
            print("Invalid option. Please select 1-4.")

if __name__ == "__main__":
    main()